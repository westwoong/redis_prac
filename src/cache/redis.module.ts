import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisService } from './redis.service';
import Redis from "ioredis";


@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          host: 'localhost',
          port: 6379,
          ttl: 60,
        }),
      }),
    }),
  ],
  providers: [RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis();
      },
    },
  ],
  exports: [RedisService, CacheModule, 'REDIS_CLIENT'],
})
export class RedisModule {
}