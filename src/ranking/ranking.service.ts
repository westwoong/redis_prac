import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from '../orm/prisma.service';
import { ScoreRequestDto } from "../score/dto/score.req.dto";

@Injectable()
export class RankingService {
  private readonly logger = new Logger(RankingService.name);

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly prismaService: PrismaService,
  ) {
  }

  async addScore(data: ScoreRequestDto): Promise<void> {
    const { score, userId } = data;
    this.logger.debug(`점수 추가 : ${ score } 사용자 ${ userId }`);
  }

} 