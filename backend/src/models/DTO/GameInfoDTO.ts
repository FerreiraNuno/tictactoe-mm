import {UserInfoDTO} from "./UserInfoDTO";

export class GameInfoDTO {
    constructor(
        private gameId: number,
        private player1: UserInfoDTO,
        private player2: UserInfoDTO
    ) {
    }
}