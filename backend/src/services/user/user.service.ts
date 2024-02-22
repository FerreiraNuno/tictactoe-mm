import {Reflector} from '@nestjs/core';
import {HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {User} from "../../models/db-models/User";
import {EncryptService} from "../encrypt/encrypt.service";
import {UserInfoDTO} from "../../models/DTO/UserInfoDTO";
import {CreateUserDTO} from "../../models/DTO/CreateUserDTO";
import {LoginDTO} from "../../models/DTO/LoginDTO";
import {response, Response} from "express";
import {AuthService} from "../auth/auth.service";
import {UpdateUserDTO} from "../../models/DTO/UpdateUserDTO";

@Injectable()
export class UserService {
    private readonly userRepository: Repository<User>;

    constructor(
        private dataSource: DataSource,
        private reflector: Reflector,
        private encryptService: EncryptService,
        private authService: AuthService
    ) {
        this.userRepository = dataSource.getRepository(User);
        this.userRepository.create(new User());
    }

    async getAllUsers() {
        const users: UserInfoDTO[] = []
        const allUsers = await this.userRepository.find();
        for (const user of allUsers) {
            users.push(UserInfoDTO.fromUser(user))
        }
        return users
    }

    async register(user: CreateUserDTO) {
        const userAlreadyExists = await this.userRepository.exists({where: {username: user.username}});
        if (userAlreadyExists) throw new HttpException(`User '${user.username}' already exists`, HttpStatus.CONFLICT);

        let newUser: User = new User();
        newUser.username = user.username;
        newUser.password = await this.encryptService.encryptPassword(user.password);
        newUser = await this.userRepository.save(newUser);
        if (newUser.id == 1) {
            newUser.isAdmin = true;
            newUser = await this.userRepository.save(newUser);
            console.log(`first user '${newUser.username}' was create. so it got updated to being an admin user`)
        }
        return UserInfoDTO.fromUser(newUser)
    }

    async login(user: LoginDTO, response: Response) {
        const foundUser = await this.userRepository.findOne({where: {username: user.username}});
        if (!foundUser) {
            throw new HttpException("Username or Password is wrong", HttpStatus.NOT_FOUND);
        }
        const isPasswordRight = await this.encryptService.compare(user.password, foundUser.password);
        if (!isPasswordRight) {
            throw new HttpException("Username or Password is wrong", HttpStatus.NOT_FOUND);
        }
        //TODO: we only are using the user-id as an cookie because is is not clear yet if we are allowed to use jwt tokens
        const token = await this.authService.signIn(foundUser.id, foundUser.username);
        response.cookie('game-userid', token)
        response.status(HttpStatus.OK)
        return UserInfoDTO.fromUser(foundUser)
    }

    async getUser(id: number): Promise<User> {
        return this.userRepository.findOneBy({id})
    }

    async getUserByRequest(req: Request): Promise<User> {
        const id = req.headers['user-id'];
        if (!id) {
            throw new UnauthorizedException("no user id provided")
        }
        const foundUser = await this.userRepository.findOneBy({id});
        if (!foundUser) {
            throw new UnauthorizedException("user not found")
        }
        return foundUser
    }

    async uploadImage(id: number, file: Express.Multer.File) {
        let user = await this.userRepository.findOneBy({id});
        if (!user) {
            throw new NotFoundException(`User with ID '${id}' not found`);
        }

        user.image = file.buffer
        user = await this.userRepository.save(user);
        user.image == null ? response.status(HttpStatus.INTERNAL_SERVER_ERROR) : response.status(HttpStatus.OK)
        return response
    }

    async getImage(id: number) {
        const user = await this.userRepository.findOneBy({id});
        if (!user) {
            throw new NotFoundException(`User with ID '${id}' not found`);
        }

        return user.image
    }

    async userExists(id: number): Promise<boolean> {
        return await this.userRepository.exists({where: {id}});
    }

    checkUserInfo(username: string, password: string) {
        if (password.length < 8 || password.length > 72) {
            throw new HttpException("The password must be between 8 and 72 characters", HttpStatus.BAD_REQUEST);
        }

        if (username.length < 2 || username.length > 64) {
            throw new HttpException("The username must be between 2 and 64 characters", HttpStatus.BAD_REQUEST);
        }
    }

    async updateUser(id: number, user: UpdateUserDTO) {
        const encryptedPassword = await this.encryptService.encryptPassword(user.password);
        await this.userRepository.update({id: id}, {username: user.username, password: encryptedPassword});
        const updatedUser = await this.getUser(id);
        return UserInfoDTO.fromUser(updatedUser)
    }

    async isUserAdmin(userId: number): Promise<boolean> {
        return await this.userRepository.exists({where: {id: userId, isAdmin: true}});
    }

    async setAdmin(id: number, booleanValue: boolean) {
        const updateResult = await this.userRepository.update({id: id}, {isAdmin: booleanValue});
        return updateResult.affected
    }
}
