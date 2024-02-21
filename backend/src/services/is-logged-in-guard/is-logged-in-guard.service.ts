import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";
import {SessionData} from "express-session";
import {UserService} from "../user/user.service";

@Injectable()
export class IsLoggedInGuard implements CanActivate {

    constructor(
        private userService: UserService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.headers['ttt-userid'];
        if (!userId) {
            throw new UnauthorizedException('User ID is required');
        }

        return this.userService.getUser(Number(userId)).then(user => {
            if (!user) {
                throw new UnauthorizedException('Access denied');
            }

            return true;
        })
    }

}

