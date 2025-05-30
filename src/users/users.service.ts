import { Injectable } from '@nestjs/common';
import { PrismaService } from "../orm/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prismaClient: PrismaService) {
  }

  getUser(id: string) {
    const parseId = parseInt(id);
    return this.prismaClient.users.findUnique({ where: { id: parseId } });
  }
}
