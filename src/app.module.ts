import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RedisModule } from './cache/redis.module';
import { RankingModule } from './ranking/ranking.module';
import { ScoreModule } from "./score/score.module";

@Module({
  imports: [
    UsersModule,
    RedisModule,
    RankingModule,
    ScoreModule,
  ],
  providers: [],
})
export class AppModule {
}
