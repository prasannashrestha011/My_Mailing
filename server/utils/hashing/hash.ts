import argon from 'argon2'

export async function hashPassword(password:string):Promise<string>{
    return argon.hash(password)
}
export async function comparePassword(storedPassword:string,plainPassword:string):Promise<boolean>{
    return argon.verify(storedPassword,plainPassword)
}