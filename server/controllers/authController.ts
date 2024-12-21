import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "../Dto/userDtos";
import { comparePassword, hashPassword } from "../utils/hashing/hash";
import { createUser, getUser } from "../repositories/userRepository";

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
    res.status(200).json({"accountDetails":foundUser})
    }catch(err){
        next()
    }
}