import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RedisModule } from './cache/redis.module';

@Module({
  imports: [
    UsersModule,
    RedisModule,
  ],
  providers: [],
})
export class AppModule {
}
