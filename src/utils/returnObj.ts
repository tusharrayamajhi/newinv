import { HttpStatus } from '@nestjs/common';


export function returnObj(statusCode: HttpStatus, message: string, data?:any,total?:number) {
    return {
        statusCode: statusCode,
        message: message,
        data: data,
        total:total
    }
}
