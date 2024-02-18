import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { User } from "./models/User";
import { DataSource, Repository } from "typeorm";
import { CreateUserDTO } from "./models/DTO/CreateUserDTO";
import { EncryptService } from "./services/encrypt/encrypt.service";
import { LoginDTO } from "./models/DTO/LoginDTO";
import { AuthService } from "./services/auth/auth.service";

@Controller("user")
export class UserController {
  private readonly userRepository: Repository<User>;
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
    private encryptService: EncryptService,
    private authService: AuthService
  ) {
    this.userRepository = dataSource.getRepository(User);
    this.userRepository.create(new User());
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  @Post()
  async addUser(@Body() user: CreateUserDTO): Promise<User> {
    const userAlreadyExists = await this.userRepository.exists({ where: { username: user.username } });
    if (userAlreadyExists) throw new HttpException(`User '${user.username}' already exists`, HttpStatus.CONFLICT);
    const newUser = new User();
    newUser.username = user.username;
    newUser.password = await this.encryptService.encryptPassword(user.password);
    return await this.userRepository.save(newUser);
  }

  @Post("/login")
  async login(@Body() user: LoginDTO): Promise<string> {
    const foundUser = await this.userRepository.findOne({ where: { username: user.username } });
    if (!foundUser) {
      throw new NotFoundException();
    }
    const isPasswordRight = await this.encryptService.compare(user.password, foundUser.password);
    if (!isPasswordRight) {
      throw new HttpException("Username or Password is wrong", HttpStatus.NOT_FOUND)
    }

    return await this.authService.signIn(foundUser.id, foundUser.username)
  }
}
