import { ApiProperty } from "@nestjs/swagger";

export class MakeMoveDTO {


    @ApiProperty()
    gameId: number

    @ApiProperty()
    xPos: number

    @ApiProperty()
    yPos: number
}