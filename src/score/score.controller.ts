import { Body, Controller, Post } from '@nestjs/common';
import { RankingService } from "../ranking/ranking.service";
import { ScoreRequestDto } from "./dto/score.req.dto";

@Controller('score')
export class ScoreController {
  constructor(private readonly rankingService: RankingService) {
  }

  @Post()
  addScore(@Body() req: ScoreRequestDto) { // 실무에선 userId에 커스텀 데코레이터를 쓰던가 guard 에서 헤더 userId 추출하기
    return this.rankingService.addScore(req)
  }
}
