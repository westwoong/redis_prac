import { Module } from '@nestjs/common';
import { ScoreController } from './score.controller';
import { RankingModule } from "../ranking/ranking.module";

@Module({
  imports: [RankingModule],
  controllers: [ScoreController]
})
export class ScoreModule {
}
