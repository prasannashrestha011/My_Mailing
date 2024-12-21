import { PrismaClient, user_model } from "@prisma/client";
import { CreateUserDto } from "../Dto/userDtos";

const prisma=new PrismaClient()

export async function createUser(userDetails:CreateUserDto):Promise<boolean>{
   try{
    const {username,password,emailAddress}=userDetails
    const personalDetails=userDetails.personalDetails
    const newUser=await prisma.user_model.create({
        data:{
            username,
            password,
            emailAddress,
        }
    });
    await prisma.user_profile.create({
        data:{
            profileId:personalDetails.profileId,
            fullName:personalDetails.fullName,
            contactNumber:personalDetails.contactNumber,
            dateOfBirth:personalDetails.dateOfBirth,
            userId:newUser.userId,
            profile_uri:personalDetails.profile_uri ?? "default"
        }
    }) 
    return true
   }catch(err){
    console.log(err)
    return false
   } 
}
function serializeData(data: any) {
    return JSON.parse(JSON.stringify(data, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
}
export async function getUser(username:string){
    try{

     
       
        //getting user from db
        const foundUser = await prisma.user_model.findUnique({
            where:{
                username:username
            },
            include:{
                profile:true
            }
        });

        if(!foundUser){
            throw new Error("user not found")
        }
        return foundUser ? serializeData(foundUser) : null;
    }catch(err){
        console.log(err)
        return null
    }
}
export async function getRefreshToken(userId:string){
    const foundToken=await prisma.refresh_token.findUnique({
        where:{
            userId
        }
    })
    return foundToken
}