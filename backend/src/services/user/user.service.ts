import {Reflector} from '@nestjs/core';
import {HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {User} from "../../models/db-models/User";
import {EncryptService} from "../encrypt/encrypt.service";
import {UserInfoDTO} from "../../models/DTO/UserInfoDTO";
import {CreateUserDTO} from "../../models/DTO/CreateUserDTO";
import {LoginDTO} from "../../models/DTO/LoginDTO";
import {response, Response} from "express";

@Injectable()
export class UserService {
    private readonly userRepository: Repository<User>;

    constructor(
        private dataSource: DataSource,
        private reflector: Reflector,
        private encryptService: EncryptService,
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
        response.cookie('ttt-userid', foundUser.id)

        return UserInfoDTO.fromUser(foundUser)
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
        let user = await this.userRepository.findOneBy({id});
        if (!user) {
            throw new NotFoundException(`User with ID '${id}' not found`);
        }

        return user.image
    }
}
