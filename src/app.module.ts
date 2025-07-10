import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RedisModule } from './cache/redis.module';
import { RankingModule } from './ranking/ranking.module';
import { ScoreModule } from "./score/score.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerModule } from "./common/logger/logger.module";

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
      inject: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongoUrl = configService.get<string>('MONGODB_URL');
        if (!mongoUrl) {
          return { uri: 'fail' };
        }
        return { uri: mongoUrl };
      },
    }),
  ],
  providers: [],
})
export class AppModule {
}
