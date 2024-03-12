import { ApiProperty } from "@nestjs/swagger"

export class InGameMassageDTO {

    @ApiProperty()
    gameId: number

    @ApiProperty()
    username: string

    @ApiProperty()
    message: string
}