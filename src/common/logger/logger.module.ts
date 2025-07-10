import { Global, Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { Log, LogSchema } from "./log.schema";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])
  ]
})
export class LoggerModule {
}
