import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { RankingService } from "./ranking.service";

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  getUserRanking(@Param('userId') userId: string) {
    return this.rankingService.getRankingDesc(userId);
  }
}
