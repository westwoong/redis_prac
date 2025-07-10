import { Global, Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { Log, LogSchema } from "../schema/log.schema";
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])
  ],
  providers: [LoggerService]
})
export class LoggerModule {
}
