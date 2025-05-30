import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CacheModule } from './cache/cache.module';
import { RedisModule, RedisModuleOptions } from "@nestjs-modules/ioredis";

@Module({
  imports: [
    UsersModule,
    CacheModule,
    RedisModule.forRootAsync({
      useFactory: (): RedisModuleOptions => ({
        type: 'single',
        options: {
          host: 'localhost',
          port: 6379,
          db: 2,
        },
      }),
    }),
  ],
  providers: [],
})
export class AppModule {
}
