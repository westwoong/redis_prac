import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export type LogDocument = Log & Document;
enum LogLevel {
  error,
  warn,
  info,
  debug
}

enum LogType {
  auth,
  system,
  request,
  query,
  exception,
  error,
  business
}

@Schema({
  timestamps: true,
  collection: "logs",
})
export class Log {
  @Prop({ required: true, enum: LogLevel })
  errorLevel: LogLevel

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: LogType })
  type: LogType;

  @Prop()
  userId?: number;

  @Prop()
  httpMethod?: string;

  @Prop()
  url?: string;

  @Prop()
  statusCode?: number;

  @Prop()
  errorMessage?: string;

  @Prop({ type: Date, required: true, default: () => new Date(), expires: 60 }) // 60초 TTL 테스트 (60초 후 삭제)
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);