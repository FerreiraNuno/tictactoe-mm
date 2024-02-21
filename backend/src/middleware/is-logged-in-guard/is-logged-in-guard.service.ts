import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {UserService} from "../../services/user/user.service";
import {AuthService} from "../../services/auth/auth.service";

@Injectable()
export class IsLoggedInGuard implements CanActivate {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const jwtToken = request.cookies['ttt-userid'];
        if (!jwtToken) {
            throw new UnauthorizedException('User ID is required');
        }

        return this.authService.getUserId(jwtToken).then(async userId => {
            const user = await this.userService.userExists(userId);
            if (!user) {
                throw new UnauthorizedException('Access denied');
            }

            request.headers['user-id'] = userId
            return true;
        })

    }

}

