export interface CreateUserDto{
    emailAddress:string 
    username:string 
    password:string 
    personalDetails:{
        profileId?:string
        fullName:string 
        contactNumber:number 
        dateOfBirth:string 
        profile_uri?:string 
        userId?:string
    }
}