import { ApiProperty } from "@nestjs/swagger";
import { User } from "../db-models/User";

export class UserInfoDTO {

  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  mmr: number;

  @ApiProperty()
  isAdmin: boolean;

  static fromUser(user: User): UserInfoDTO {
    const userInfoDTO = new UserInfoDTO();
    userInfoDTO.id = user.id;
    userInfoDTO.username = user.username;
    userInfoDTO.mmr = user.mmr;
    userInfoDTO.isAdmin = user.isAdmin;
    return userInfoDTO;
  }
}