import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post, Res, SetMetadata, UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { User } from "../models/db-models/User";
import { CreateUserDTO } from "../models/DTO/CreateUserDTO";
import { LoginDTO } from "../models/DTO/LoginDTO";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { UserInfoDTO } from "../models/DTO/UserInfoDTO";
import { UserService } from "../services/user/user.service";
import {IsLoggedInGuard} from "../services/is-logged-in-guard/is-logged-in-guard.service";
import {IsAdminGuard} from "../services/is-admin/is-admin-guard.service";


@Controller("/api/v1/user")
@ApiTags('user')
export class UserController {

  constructor(
    private userService: UserService,
  ) {
  }

  @Get("/all")
  @UseGuards(IsAdminGuard)
  @SetMetadata('roles', ['admin'])
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all users', type: UserInfoDTO, isArray: true})
  @ApiResponse({ type: User, isArray: true})
  async getUsers(): Promise<UserInfoDTO[]> {
    return await this.userService.getAllUsers()
  }

  @Post("/register")
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The user was created successfully', type: UserInfoDTO})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The Password or the username are to short or to long'})
  @ApiResponse({ type: User })
  async addUser(@Body() user: CreateUserDTO): Promise<UserInfoDTO> {
    if (user.password.length < 8 || user.password.length > 72) {
      throw new HttpException("The password must be between 8 and 72 characters", HttpStatus.BAD_REQUEST);
    }

    if (user.username.length < 2 || user.username.length > 64) {
      throw new HttpException("The username must be between 2 and 64 characters", HttpStatus.BAD_REQUEST);
    }

    return await this.userService.register(user)
  }

  @Post("/login")
  @ApiResponse({description: "If the user cann not be found an NOT_FOUND will be returned. We will not specify if the password was wrong or the username", status: HttpStatus.NOT_FOUND})
  @ApiResponse({type: UserInfoDTO, description: "After a successful login a 'ttt-userid' cookie will be set to identify the user for future requests", status: HttpStatus.OK})
  async login(@Body() user: LoginDTO, @Res({ passthrough: true }) response: Response): Promise<UserInfoDTO> {
    return await this.userService.login(user, response)
  }

  @Post('/:id/upload-image')
  @UseGuards(IsLoggedInGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponse({ status: 200, description: 'Image uploaded successfully', type: Response })
  async uploadImage(@Param('id') id: number,@UploadedFile() file: Express.Multer.File): Promise<Response> {
    return await this.userService.uploadImage(id, file)
  }

  @Get('/:id/image')
  @UseGuards(IsLoggedInGuard)
  @ApiResponse({ status: 200, description: 'Image uploaded successfully', type: Buffer })
  async getImage(@Param('id') id: number, @Res() res) {
    const image: Buffer = await this.userService.getImage(id);
    res.type('image/jpeg');
    res.send(image);
  }
}
