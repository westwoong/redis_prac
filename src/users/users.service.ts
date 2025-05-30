import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "../orm/prisma.service";
import { RedisService } from "../cache/redis.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaClient: PrismaService,
    private readonly redisService: RedisService,
  ) {
  }

  async getUser(id: string) {
    const parseId = parseInt(id);
    const key = `user:${ parseId }`;
    const cached = await this.redisService.get(key);
    if (cached) return cached;

    const user = await this.prismaClient.users.findUnique({ where: { id: parseId } });
    if (!user) throw new NotFoundException('not fount');
    await this.redisService.set(key, user, 60)
    return user;
  }

  async getAll() {
    return await this.redisService.allGet();
  }
}
