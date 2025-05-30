import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV == 'debug' ? [
        {
          emit: 'event',
          level: 'query'
        },
        {
          emit: 'stdout',
          level: 'info'
        },
        {
          emit: 'stdout',
          level: 'warn'
        },
        {
          emit: 'stdout',
          level: 'error'
        }
      ] : []
    });
  }

  async onModuleInit() {
    await this.$connect();

    // 로깅 미들웨어 나중에 로깅 파일이나 DB 로그로 변경예정
    this.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();

      if (process.env.NODE_ENV === 'debug' || process.env.NODE_ENV === 'local') {
        this.logger.log(`Query ${ params.model }.${ params.action } took ${ after - before }ms`);
      }
      return result;
    });

    // SQL 쿼리 로깅
    (this as any).$on('query', (request: any) => {
      if (process.env.NODE_ENV === 'debug' || process.env.NODE_ENV === 'local') {
        this.logger.log(`SQL Query: ${ request.query }`);
        this.logger.log(`Params: ${ request.params }`);
        this.logger.log(`Duration: ${ request.duration }ms`);
      }
    });
  }

  // 프리즈마 커넥션 끊는용도
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // 트랜잭션용 메서드 (사용 보류중 DB 버전 업그레이드 사용)
  async executeTransaction(actions: (prisma: PrismaClient) => Promise<any>) {
    return this.$transaction(actions);
  }

  // 에러 핸들링 (보류중)
  async handleQuery(queryFunction: () => Promise<any>) {
    try {
      return await queryFunction();
    } catch (error) {
      if (process.env.NODE_ENV === 'debug' || process.env.NODE_ENV === 'local') {
        this.logger.error('Prisma error:', error);
      }
      throw error;
    }
  }
}
