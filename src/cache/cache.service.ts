import { Injectable } from '@nestjs/common';
import Redis from "ioredis";
import { InjectRedis } from "@nestjs-modules/ioredis";

@Injectable()
export class CacheService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
  ) {
  }

  async set(key: string, value: any, ttlSeconds = 60): Promise<void> { // TTL 미설정 시 기본 60초
    const stringValue = JSON.stringify(value);
    await this.redisClient.set(key, stringValue, 'EX', ttlSeconds);
  }

  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }
}
