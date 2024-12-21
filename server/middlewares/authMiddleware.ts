import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt/jwt";

export async function authMiddleware(req:Request,res:Response,next:NextFunction){
    const accessToken=req.cookies.accessToken;
    if(!accessToken){
        res.status(401).json({err:"Request unauthorized, Please sign in."})
        return 
    }
    const isVerified=await verifyJwt(accessToken)
    if(!isVerified.success){
        res.status(isVerified.statusCode).json({message:isVerified.message})
        return
    }
    next()
}