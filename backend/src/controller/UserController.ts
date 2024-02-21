import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus, NotFoundException,
    Param,
    Post, Put, Req, Res, SetMetadata, UnauthorizedException, UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {User} from "../models/db-models/User";
import {CreateUserDTO} from "../models/DTO/CreateUserDTO";
import {LoginDTO} from "../models/DTO/LoginDTO";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {Response} from "express";
import {UserInfoDTO} from "../models/DTO/UserInfoDTO";
import {UserService} from "../services/user/user.service";
import {IsLoggedInGuard} from "../middleware/is-logged-in-guard/is-logged-in-guard.service";
import {IsAdminGuard} from "../middleware/is-admin/is-admin-guard.service";
import {UpdateUserDTO} from "../models/DTO/UpdateUserDTO";
import {OK} from "sqlite3";
import {isNumber} from "@nestjs/common/utils/shared.utils";


@Controller("/api/v1/user")
@ApiTags('user')
export class UserController {

    constructor(
        private userService: UserService,
    ) {
    }

    @Get("/all")
    @ApiResponse({status: HttpStatus.OK, description: 'Returns all users', type: UserInfoDTO, isArray: true})
    @UseGuards(IsAdminGuard)
    @ApiResponse({type: User, isArray: true})
    async getUsers(): Promise<UserInfoDTO[]> {
        return await this.userService.getAllUsers()
    }

    @Put("/:id/set-admin/:booleanValue")
    @UseGuards(IsAdminGuard)
    @ApiResponse({status: HttpStatus.OK, description: 'Set a users admin status to true or false'})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'no user was found to update admin status'})
    async setAdmin(@Req() req: Request, @Param("id") id: number, @Param("booleanValue") booleanString: string) {
        id = Number(id)
        const isAdmin: boolean = (booleanString.toLowerCase() == "true")
        const number: number = await this.userService.setAdmin(id, isAdmin)
        if (number != 1) {
            throw new NotFoundException("could not find the user to be set admin status")
        }
        return HttpStatus.OK
    }

    @Post("/register")
    @ApiResponse({status: HttpStatus.CREATED, description: 'The user was created successfully', type: UserInfoDTO})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'The Password or the username are to short or to long'})
    @ApiResponse({type: UserInfoDTO})
    async addUser(@Body() user: CreateUserDTO): Promise<UserInfoDTO> {
        this.userService.checkUserInfo(user.username, user.password)
        return await this.userService.register(user)
    }

    @Post("/login")
    @ApiResponse({
        description: "If the user cann not be found an NOT_FOUND will be returned. We will not specify if the password was wrong or the username",
        status: HttpStatus.NOT_FOUND
    })
    @ApiResponse({
        type: UserInfoDTO,
        description: "After a successful login a 'ttt-userid' cookie will be set to identify the user for future requests",
        status: HttpStatus.OK
    })
    async login(@Body() user: LoginDTO, @Res({passthrough: true}) response: Response): Promise<UserInfoDTO> {
        return await this.userService.login(user, response)
    }

    @Put("/update-user")
    @ApiResponse({status: HttpStatus.OK, description: 'The user was updated successfully', type: UserInfoDTO})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'The Password or the username are to short or to long'})
    @UseGuards(IsLoggedInGuard)
    @ApiResponse({type: User})
    async updateUser(@Body() user: UpdateUserDTO, @Req() req: Request): Promise<UserInfoDTO> {
        const id = req.headers['user-id'];
        this.userService.checkUserInfo(user.username, user.password)
        return await this.userService.updateUser(id, user)
    }

    @Put('/:id/upload-image')
    @UseGuards(IsLoggedInGuard)
    @UseInterceptors(FileInterceptor('image'))
    @ApiResponse({status: 200, description: 'Image uploaded successfully', type: Response})
    async uploadImage(@Param('id') id: number, @UploadedFile() file: Express.Multer.File, @Req() req: Request): Promise<Response> {
        const user: User = await this.userService.getUserByRequest(req)
        if (!user.isAdmin && user.id != id) {
            throw new UnauthorizedException("only admin can upload images to other users profiles")
        }
        return await this.userService.uploadImage(id, file)
    }

    @Get('/:id/image')
    @UseGuards(IsLoggedInGuard)
    @ApiResponse({status: 200, description: 'Image uploaded successfully', type: Buffer})
    async getImage(@Param('id') id: number, @Res() res: Response) {
        const image: Buffer = await this.userService.getImage(id);
        res.type('image/jpeg');
        res.send(image);
    }
}