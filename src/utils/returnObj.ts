export function returnObj(statusCode,message,data?){
    return {
        statusCode:statusCode,
        message:message,
        data:data
    }
}