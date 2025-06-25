import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { PrismaModule } from '../orm/prisma.module';
import { RedisModule } from "../cache/redis.module";

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [RankingService],
  exports: [RankingService],
})
export class RankingModule {
}