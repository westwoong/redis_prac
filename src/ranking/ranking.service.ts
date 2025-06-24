import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    const isExistUser = await this.prismaService.users.findUnique({ where: { id: userId } });
    if (isExistUser) throw new NotFoundException();
    try {
      await this.prismaService.dailyRanking.create({ data: { userId: userId, score: score } });
    } catch (error) {
      this.logger.error(error);
    }
    this.logger.debug(`점수 추가 : ${ score } 사용자 ${ userId }`);
  }

} 