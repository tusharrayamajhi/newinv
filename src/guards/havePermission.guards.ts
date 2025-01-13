import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import { roles } from "src/object/roles.object";
import { PermissionService } from "src/services/Permission.services";

@Injectable()
export class havePermissionGuards implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private permissionService: PermissionService
    ) {
    }
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const permission  = this.reflector.get<string[]>('permission', context.getHandler());
        const req = context.switchToHttp().getRequest();
        const token = req.headers.authorization;
        if (!token) {
            return false;
        }
        const newToken = token.split(" ")[1]
        const user = await this.jwtService.decode(await this.cacheManager.get(`token:${newToken}`));
        if (!user) {
            return false;
        }
        if(user.role == roles.Admin || user.role == roles.SuperAdmin){
            req.user = user;   
            return true;
        }
         const havePermission = await this.permissionService.havePermission(user,permission)
        if (havePermission) {
            req.user = user;
            return true
        } else {
            return false
        }
    }

}