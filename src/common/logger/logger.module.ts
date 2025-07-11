import { Global, Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { Log, LogSchema } from "./schema/log.schema";
import { LoggerService } from './logger.service';
import { LoggingInterceptor } from './logging.interceptor';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])
  ],
  providers: [LoggerService, LoggingInterceptor],
  exports: [LoggerService, LoggingInterceptor] // 다른 모듈에서 사용할 수 있도록 export
})
export class LoggerModule {
}
