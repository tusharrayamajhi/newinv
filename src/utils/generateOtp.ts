import * as crypto from 'crypto';  

export const generateOtp=()=>{
    return crypto.randomInt(1000,9999).toString();
}