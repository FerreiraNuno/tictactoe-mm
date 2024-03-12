import {ApiProperty} from "@nestjs/swagger";

export class WinLoseDTO {

    @ApiProperty()
    wins: number

    @ApiProperty()
    losses: number

    @ApiProperty()
    winLoseRate: number

    @ApiProperty()
    total: number

    @ApiProperty()
    draws: number;
}