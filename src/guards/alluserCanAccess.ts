import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AllUserCanAccess implements CanActivate {
    constructor(
        private jwtService:JwtService,
        @Inject(CACHE_MANAGER) private cacheManager:Cache,
    ) {}

    async canActivate(context: ExecutionContext):Promise<boolean>{
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
        if(user){
            req.user = user
            return true
        }
        return false
    }
}

