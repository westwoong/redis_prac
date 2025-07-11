import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { RedisModule } from './cache/redis.module';
import { RankingModule } from './ranking/ranking.module';
import { ScoreModule } from "./score/score.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerModule } from "./common/logger/logger.module";
import { PostModule } from './posts/post.module';
import { LoggingInterceptor } from './common/logger/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    RedisModule,
    RankingModule,
    ScoreModule,
    LoggerModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUrl = configService.get<string>('MONGODB_URL');
        if (!mongoUrl) {
          return { uri: 'fail' };
        }
        return { uri: mongoUrl };
      },
    }),
    PostModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
}
