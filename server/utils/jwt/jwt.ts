import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { getRefreshToken } from '../../repositories/userRepository'
import { checkJwtExpiration } from './jwtMethods'

const jwtSecretKey=process.env.JWT_SECRET
const refreshKey=process.env.REFRESH_TOKEN_SECRET

const prisma= new PrismaClient()

// for generating access and refresh token
export async function generateJwt(userId:string):Promise<string |null>{
    if(!jwtSecretKey){
        console.log("jwt secret not provided")
        return null
    }
    const payload={
        userId
    }
    const token=jwt.sign(payload,jwtSecretKey,{expiresIn:"1h"})
    return token
}
export async function generateRefreshToken(userId:string):Promise<{success:boolean,message:string}>{
    try{
      if(!userId || !refreshKey){
        throw new Error("Either userId or refreshKey is unavailable")
      }
      //setting expiry time of 7 days
      const  expiredAt=new Date()
      expiredAt.setDate(expiredAt.getDate()+7)

      const payload={userId}
      const refreshToken= jwt.sign(payload,refreshKey,{expiresIn:'7d'})
      if(!refreshToken){
        throw new Error("Unable to generate refresh token");
      }
      //storing refresh token in db for validation
      await prisma.refresh_token.upsert({
        where:{
            userId,
        },
        create:{
            userId,
            expiredAt,
            token:refreshToken
        },
        update:{
            token:refreshToken,
            expiredAt
        }
      })
      return {success:true,message:refreshToken}
    }catch(err){
        console.log(err)
        let errMessage=err as Error
        return {success:false,message:errMessage.message??"Unknow error occured"}
    }
}

export async function verifyJwt(token:string):Promise<{success:boolean,statusCode:number,message:string}>{
    if(!token || !jwtSecretKey){
        return {success:false,statusCode:403,message:"token or secret key not provided"}
    }
     const decodedToken:any=jwt.verify(token,jwtSecretKey)
     console.log(decodedToken)
     const isTokenAlive=checkJwtExpiration(decodedToken.exp)
     if(!isTokenAlive) return {success:false,statusCode:401,message:"token expired"}

     return {success:true,statusCode:200,message:"token is alive"}
}

export async function verifyRefreshToken(refreshToken:string):Promise<{success:boolean,message:string}>{
    try{
    if(!refreshToken || !refreshKey){
            console.log("")
            return {success:false, message:"Either refresh token or refresh key is not provided"}
    }
    const decoded:any=jwt.verify(refreshToken,refreshKey)
    if(!decoded.userId){
        console.log("Invalid token")
        return {success:false,message:"Invalid token"}
    }
    const foundToken=await getRefreshToken(decoded.userId)

    if(foundToken?.token!==refreshToken){
        console.log("Invalid token")
        return {success:false,message:"Invalid token"}
    }
    if(new Date(foundToken.expiredAt)<=new Date()){
        console.log(" refresh token expired")
        return {success:true,message:foundToken.userId}
    }
    return {success:true,message:"Refresh token is valid"}
    }catch(err){
        console.log(err)
        return {success:false,message:"Unknow error occured"}
    }
}

//validating refresh token and get new access token
export async function refreshAccessToken(refreshToken:string):Promise<{success:boolean,message:string}>{
    try{
        //verifying the refresh token before making new access token
        const tokenVerification=await verifyRefreshToken(refreshToken)
        if(!tokenVerification.success){
            return {success:false,message:tokenVerification.message}
        }
        const userId=tokenVerification.message
        const newAccessToken=await generateJwt(userId)
        if(!newAccessToken){
            return {success:false,message:"failed to generate access token"}
        }
        return {success:true,message:newAccessToken}
    }catch(err){
        const errMessage= err as Error
        return {success:false,message:errMessage.message}
    }
}