import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('REDIS_CLIENT') private redisClient: Redis,
  ) {
  }

  async zset(key: string, score: number, userId: number) {
    try {
      const userScore = await this.redisClient.zincrby(key, score, userId);
      this.logger.log(`zet KEY ${key} score: ${score} userId: ${userId}`);
      return parseFloat(userScore);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async zGetDesc(key: string, userId: string) {
    try {
      const rank = await this.redisClient.zrevrank(key, userId);
      const score = await this.redisClient.zscore(key, userId);
      this.logger.log(`zet KEY ${key} score: ${rank}`);
      return {rank, score};
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async allGet() {
    try {
      const keys = await this.redisClient.keys('*');
      const result = {};

      if (keys.length === 0) {
        this.logger.debug('저장된 캐시 없음');
        return result;
      }

      const values = await this.redisClient.mget(...keys);
      keys.forEach((key, idx) => {
        result[key] = values[idx];
      });

      return result;
    } catch (err) {
      this.logger.error('Redis 전체 조회 중 오류 발생', err.stack);
      return null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      if (value) this.logger.debug(`히트 key: ${key}`);
      else this.logger.debug(`미스 key: ${key}`);
      return value;
    } catch (err) {
      this.logger.error(`오류 : ${key}`, err.stack);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttlSeconds * 1000);
    } catch (err) {
      this.logger.error(`오류 : ${key}`, err.stack);
    }
  }
}