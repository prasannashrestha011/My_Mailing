import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "../Dto/userDtos";
import { comparePassword, hashPassword } from "../utils/hashing/hash";
import { createUser, getUser } from "../repositories/userRepository";
import { generateJwt, generateRefreshToken, refreshAccessToken } from "../utils/jwt/jwt";

export async function registerUser(req:Request<{},{},{details:CreateUserDto}>,res:Response,next:NextFunction){
    try{
        let details=req.body.details
        console.log(details)
        if(!details){
            res.status(400).json({err:"insufficent information"})
            return 
        }

        const hashedPassword= await hashPassword(details.password)
        if(!hashedPassword){
            return 
        }
        //setting up hashedPassword
        details={
            ...details,
            password:hashedPassword
        }

        const isUserCreated=await createUser(details)
        
        if(!isUserCreated){
            res.status(403).json({err:"failed to register the account "})
            return 
        }
    res.status(200).json({message:"account created successfully"})
    
    }catch(err){
        next()
    }
}

export async function authenticateUser(req:Request<{},{},{username:string,password:string}>,res:Response,next:NextFunction){
    try{
        const {username,password}=req.body
        console.log(req.body)
        if(!username || !password){
            res.status(404).json({err:"insufficent credentails details"})
            return 
        }
        const foundUser=await getUser(username)
        if(!foundUser){
            res.status(404).json({err:"User not found !!!"})
            return 
        }
        console.log(foundUser)
        const isVerified=await comparePassword(foundUser.password,password)
        if(!isVerified){
            res.status(401).json({err:"Incorrect password"})
            return 
        }
        const jwtToken=await generateJwt(foundUser.userId)
        const refreshToken=await generateRefreshToken(foundUser.userId)
        if(!refreshToken.success){
            throw new Error(refreshToken.message)
        }
        console.log(jwtToken)
        console.log(refreshToken)
    res.cookie('accessToken',jwtToken,{
        httpOnly:true,
        secure:true,
        sameSite:'lax',
        maxAge:15*60*1000,
    })
    res.cookie('refreshToken',refreshToken.message,{
        httpOnly:true,
        secure:true,
        sameSite:'lax',
        maxAge:7*60*60*1000
    })
    res.status(200).json({"accountDetails":foundUser})
    }catch(err){
        next()
    }
}
export async function refreshAccessTokenHandler(req:Request<{},{},{userId:string,refreshToken:string}>,
    res:Response,
    next:NextFunction
){
    try{
      const {userId,refreshToken}=req.body
 
      if(!userId || !refreshToken){
          res.status(400).json({err:"Insufficent details "})
          return
      }
      const accessToken=await refreshAccessToken(refreshToken)
      if(!accessToken.success){
        res.status(400).json({err:accessToken.message})
        return
      }
      res.cookie('accessToken',accessToken.message,{
        httpOnly:true,
        sameSite:'lax',
        maxAge:7*60*60*1000
      })

      res.status(200).json({newAccessToken:accessToken.message})
    }catch(err){
        next()
    }
}