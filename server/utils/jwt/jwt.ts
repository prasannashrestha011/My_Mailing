import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { getRefreshToken } from '../../repositories/userRepository'

const secretKey=process.env.JWT_SECRET
const refreshKey=process.env.REFRESH_TOKEN_SECRET

const prisma= new PrismaClient()


export async function generateJwt(userId:string):Promise<string |null>{
    if(!secretKey){
        console.log("jwt secret not provided")
        return null
    }
    const payload={
        userId
    }
    const token=jwt.sign(payload,secretKey,{expiresIn:"1h"})
    return token
}
export async function generateRefreshToken(userId:string):Promise<string | null>{
    if(!userId || !refreshKey){
        console.log("Either username or refresh key is unavailable")
        return null
    }
    const payload={userId}
    const refreshToken= jwt.sign(payload,refreshKey,{expiresIn:'30d'})

    const expiredAt=new Date()
    expiredAt.setDate(expiredAt.getDate()+30)
    await prisma.refresh_token.create({
        data:{
            token:refreshToken,
            expiredAt,
            userId,
        }
    })
    return refreshToken;
}
export async function verifyJwt(token:string){
    if(!token || !secretKey){
        console.log("token or secret key not provided")
        return 
    }
     jwt.verify(token,secretKey,(err,decoded)=>{
        if(err){
            if(err.name=="TokenExpiredError"){
                console.log("token expired");
                return null
            }
            console.log("Unknow error occured while decoding the token")
            return
        }
        return decoded
    })
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
export async function refreshAccessToken(refreshToken:string):Promise<{success:boolean,message:string}>{
    try{
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