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
      this.logger.debug(`redis - 사용자: ${ userId }, 점수: ${ score }`);
    } catch (error) {
      this.logger.error('redis 실패:', error);
    }

    try {
      await this.saveScoreToDb(userId, score, new Date());
      this.logger.debug(`db save 사용자: ${ userId }, 점수: ${ score }`);
    } catch (error) {
      this.logger.error('db 실패:', error);
    }
  }

  async getRankingDesc(userId: string) {
    const userIdNum = parseInt(userId);
    const today = this.formatDate(new Date());
    const redisDailyRankingKey = `userRanking:daily:${ today }`;

    try {
      const redisResult = await this.redisService.zGetDesc(redisDailyRankingKey, userIdNum);
      if (redisResult.rank !== null && redisResult.score) {
        this.logger.debug(`[redis 조회] ${ redisResult }`);
        return {
          rank: redisResult.rank + 1, // 1 더해줘야함 배열같이 0부터 시작함
          score: parseFloat(redisResult.score)
        };
      }
    } catch (error) {
      this.logger.error('redis 랭킹 조회 실패:', error);
    }

    try {
      const todayDate = new Date();
      const dbRanking = await this.getDbRanking(userIdNum, todayDate);
      if (dbRanking) {
        return {
          rank: dbRanking.rank ? dbRanking.rank : '집계중',
          score: dbRanking.score
        }
      }
    } catch (error) {
      this.logger.error('db 랭킹 조회 실패:', error);
    }

    this.logger.debug('redis&db 둘 다 데이터 없음');
    return { rank: '미포함', score: '미포함' };
  }

  private async saveScoreToDb(userId: number, score: number, date: Date) {
    const userCheck = await this.prismaService.users.findUnique({ where: { id: userId } });
    if (!userCheck) throw new NotFoundException();

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const existingRanking = await this.prismaService.dailyRanking.findFirst({ where: { userId, date: dateOnly } });

    // 랭킹 있으면 점수 추가
    if (existingRanking) {
      await this.prismaService.dailyRanking.update({
        where: { id: existingRanking.id },
        data: { score: existingRanking.score + score }
      });
    } else {
      await this.prismaService.dailyRanking.create({ data: { userId, score, date: dateOnly } }); // 없으면 새로 생성
    }
  }


  private async getDbRanking(userId: number, date: Date) {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const userRanking = await this.prismaService.dailyRanking.findFirst({ where: { userId, date: dateOnly } });
    this.logger.debug(`[redis 실패 - db 조회 시작] ${ userRanking }`);
    return userRanking;
  }

  private formatDate(date: Date) { // YYYY-MM -DD
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${ year }-${ month }-${ day }`;
  }
}