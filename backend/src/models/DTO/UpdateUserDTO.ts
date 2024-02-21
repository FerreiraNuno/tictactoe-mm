import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDTO {

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}