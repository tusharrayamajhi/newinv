import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class canAccess implements CanActivate{
    constructor(
        private reflector :Reflector,
        private jwtService:JwtService,
        @Inject(CACHE_MANAGER) private cacheManager:Cache,
    ){
    }

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const roles  = this.reflector.get<string[]>('roles',context.getHandler())
        const req = context.switchToHttp().getRequest()
        const token = req.headers.authorization;
        if(!token){
            return false;
        }
        const newToken = token.split(" ")[1]
        const user = await this.jwtService.decode(await this.cacheManager.get(`token:${newToken}`));
        if(!user){
            return false;
        }
        if(roles.includes(user.role)){
            req.user = user;
            return true
        }else{
            return false
        }
        
    }
    
}