import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../orm/prisma.service';
import { ScoreRequestDto } from "../score/dto/score.req.dto";
import { RedisService } from "../cache/redis.service";

@Injectable()
export class RankingService {
  private readonly logger = new Logger(RankingService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
  ) {
  }

  async addScore(data: ScoreRequestDto): Promise<void> {
    const { score, userId } = data;
    const isExistUser = await this.prismaService.users.findUnique({ where: { id: userId } });
    if (!isExistUser) throw new NotFoundException();
    const today = this.formatDate(new Date());
    const redisDailyRankingKey = `userRanking:daily:${ today }`;

    try {
      await this.redisService.zset(redisDailyRankingKey, score, userId);
    } catch (error) {
      this.logger.error(error);
    }
    this.logger.debug(`키 : ${ redisDailyRankingKey } 점수 추가 : ${ score } 사용자 ${ userId }`);
  }

  async getRankingDesc(userId: string) {
    const today = this.formatDate(new Date());
    const redisDailyRankingKey = `userRanking:daily:${ today }`;
    try {
      const result = await this.redisService.zGetDesc(redisDailyRankingKey, userId);
      return {
        rank: result.rank !== null ? result.rank + 1 : '집계중',
        score: result.score ? parseFloat(result.score) : '집계중'
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  private formatDate(date: Date) { // YYYY-MM -DD
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${ year }-${ month }-${ day }`;
  }
}