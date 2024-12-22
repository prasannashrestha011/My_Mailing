"use client"
import { Button, IconButton, InputAdornment } from '@mui/material'
import TextField from '@mui/material/TextField'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Visibility, VisibilityOff,MarkAsUnreadSharp } from '@mui/icons-material';

import { loginDetail } from './interfaces';
import { submitLoginDetails } from './action';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
    const [form_fields,setFormFields]=useState<loginDetail>({username:"",password:""})
    const route=useRouter()
    const [isPasswordVisible,setIsPasswordVisible]=useState<boolean>(false)
    const handleFormData=(e:ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target
        setFormFields(prevField=>({
            ...prevField,
            [name]:value
        }))
    }
    const handleFormSubmission=async(e:FormEvent)=>{
        e.preventDefault()
       const response=await submitLoginDetails(form_fields)
       if(response.success){
        route.replace('/')
        
       }
        console.log(response)
    }
    const togglePasswordFieldVisibility=()=>{
        setIsPasswordVisible(!isPasswordVisible)
    }
  
  return (
    <div className='p-2 min-h-screen '>
        <header className='text-2xl w-fit mx-auto font-mono flex gap-2 cursor-pointer'>
        <MarkAsUnreadSharp/>
        <span>Post mate</span>
        </header>
     <form onSubmit={handleFormSubmission} className=' h-96 flex   flex-col justify-center items-center '>
 
        <div className='flex flex-col gap-4 h-72 justify-center items-center'>
      
            <TextField id="standard-basic" 
            label="Username" 
            name='username'
            value={form_fields.username}
            onChange={handleFormData}
            variant="outlined" 
            size='medium' 
            className='w-80' 
            />
            <TextField id="standard-basic" 
            label="Password"
             variant='outlined' 
             size='medium'  
             name='password'
             value={form_fields.password}
             onChange={handleFormData}
             type={`${isPasswordVisible?'text':'password'}`}
             className='w-80 relative'
             slotProps={{
                input:{
                    endAdornment:(
                        <InputAdornment position='end'>
                            <IconButton edge="end" onClick={togglePasswordFieldVisibility}>
                            {isPasswordVisible?<Visibility/>:<VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>
                    )
                }
             }}
             >
        
             </TextField>
             
           <div className='flex flex-col justify-end items-end w-full'>
           <a 
            className=' 
     
            text-blue-700
            text-sm cursor-pointer 
           '>Sign up</a>
            <a 
            className='text-red-800
            text-sm cursor-pointer 
           '>Forgot password</a>
           </div>
            
        </div>
        <Button variant='contained' size='large' className='w-48' type='submit'>Login</Button>
     </form>
    </div>
  )
}

export default LoginForm