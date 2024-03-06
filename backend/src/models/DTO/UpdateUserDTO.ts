import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDTO {
  @ApiProperty()
  password: string;
}