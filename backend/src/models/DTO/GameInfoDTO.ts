import {UserInfoDTO} from "./UserInfoDTO";
import {ApiProperty} from "@nestjs/swagger";

export class GameInfoDTO {
    @ApiProperty()
    public gameId: number

    @ApiProperty()
    public player1: UserInfoDTO

    @ApiProperty()
    public player2: UserInfoDTO
}