import {
    Controller,
    Get,
    HttpStatus, Req, UseGuards
} from "@nestjs/common";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserService} from "../../services/user/user.service";
import {IsLoggedInGuard} from "../../middleware/is-logged-in-guard/is-logged-in-guard.service";
import {GameResultService} from "../../services/game-result/game-result.service";
import {GameResultDTO} from "../../models/DTO/GameResultDTO";
import {User} from "../../models/db-models/User";
import {WinLoseDTO} from "../../models/DTO/WinLoseDTO";

@Controller("/api/v1/history")
@ApiTags('history')
export class HistoryController {

    constructor(
        private userService: UserService,
        private resultService: GameResultService,
    ) {
    }

    @Get("/all")
    @ApiResponse({status: HttpStatus.OK, description: 'Returns history of own game results', type: GameResultDTO, isArray: true})
    @UseGuards(IsLoggedInGuard)
    async getGameHistory(@Req() req: Request): Promise<GameResultDTO[]> {
        const user: User = await this.userService.getUserByRequest(req)
        const result: GameResultDTO[] = []
        for (const gameResult of await this.resultService.getUserMatchesOfUser(user.id)) {
            result.push(GameResultDTO.ofGameResult(gameResult))
        }
        return result
    }

    @Get("/win-lose-rate")
    @ApiResponse({status: HttpStatus.OK, description: 'Returns Win Lose Rate', type: WinLoseDTO})
    @UseGuards(IsLoggedInGuard)
    async getWinLoseRate(@Req() req: Request): Promise<GameResultDTO[]> {
        const user: User = await this.userService.getUserByRequest(req)
        const result: GameResultDTO[] = []
        for (const gameResult of await this.resultService.getUserMatchesLossesOfUser(user.id)) {
            result.push(GameResultDTO.ofGameResult(gameResult))
        }
        return result
    }


}
