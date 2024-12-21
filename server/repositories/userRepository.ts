import { PrismaClient, user_model } from "@prisma/client";
import { CreateUserDto } from "../Dto/userDtos";

const primsa=new PrismaClient()

export async function createUser(userDetails:CreateUserDto):Promise<user_model | null>{
   try{
    const {username,password,emailAddress}=userDetails
    const personalDetails=userDetails.personalDetails
    const createdDetails=await primsa.user_model.create({
        data:{
            username,
            password,
            emailAddress,
            profile:{
                create:{
                    fullName:personalDetails.fullName ,
                    contactNumber:personalDetails.contactNumber ,
                    dateOfBirth:personalDetails.dateOfBirth,
                    profile_uri:personalDetails.profile_uri,
                    profileId:personalDetails.profileId
                }
            }          
        }
    }) 
    return createdDetails
   }catch(err){
    console.log(err)
    return null
   } 
}
export async function getUser(username?:string,userId?:string):Promise<user_model|null>{
    try{
        const whereClause:any={}
        if(!username || !userId){
            throw new Error("Either userId or username is not provided")
        }
        if(username){
            whereClause.username=username
        }
        if(userId){
            whereClause.userId=userId
        }
        //getting user from db
        const foundUser=await primsa.user_model.findUnique({
            where:whereClause
        })
        if(!foundUser){
            throw new Error("user not found")
        }
        return foundUser
    }catch(err){
        console.log(err)
        return null
    }
}