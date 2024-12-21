import { NextFunction, Request, Response } from "express";
import {isHttpError} from 'http-errors'
export async function errorHandler(error:unknown,req:Request,res:Response,next:NextFunction){
    console.log(error)
    let statusCode=500;
    let errorMessage="Unknow error occured";
    if(isHttpError(error)){
        statusCode=error.status
        errorMessage=error.message
    }
    res.status(statusCode).json({err:errorMessage})
}