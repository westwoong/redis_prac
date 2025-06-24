import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RedisModule } from '../cache/redis.module';
import { PrismaModule } from '../orm/prisma.module';

@Module({
  imports: [
    RedisModule,
    PrismaModule,
  ],
  providers: [
    RankingService,
  ],
  exports: [
    RankingService,
  ],
})
export class RankingModule {
}