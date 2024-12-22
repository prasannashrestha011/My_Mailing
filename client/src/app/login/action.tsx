import axios from "axios";
import { loginDetail } from "./interfaces";
const rootURL=process.env.NEXT_PUBLIC_ROOT_URL

export async function submitLoginDetails(userDetails:loginDetail):Promise<{success:boolean,statusCode:number,message:string}>{
    try{
        console.log(rootURL)
        const response=await axios.post(`${rootURL}/api/auth/login`,userDetails,{withCredentials:true})
        if(response.status==401) throw new Error(response.data)
        return {success:true,statusCode:response.status,message:response.data??""}
    }catch(err){
        const serverErr=err as Error
        if(axios.isAxiosError(err)){
            if(err.status==401){
                return {success:false,statusCode:401,message:err.message}
            }
        }
        return {success:false,statusCode:500,message:serverErr.message??"Unknow error occured"}
    }
}