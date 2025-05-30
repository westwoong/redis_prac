import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from "../orm/prisma.service";
import { RedisService } from "../cache/redis.service";
import { RedisModule } from "../cache/redis.module";

@Module({
  imports: [RedisModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService,RedisService],
})
export class UsersModule {
}
