import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RedisModule } from './cache/redis.module';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [
    UsersModule,
    RedisModule,
    RankingModule,
  ],
  providers: [],
})
export class AppModule {
}
