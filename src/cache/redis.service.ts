import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      if (value) this.logger.debug(`Cache HIT for key: ${ key }`);
      else this.logger.debug(`Cache MISS for key: ${ key }`);
      return value;
    } catch (err) {
      this.logger.error(`Redis get error for key: ${ key }`, err.stack);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttlSeconds * 1000);
    } catch (err) {
      this.logger.error(`Redis set error for key: ${ key }`, err.stack);
    }
  }
}