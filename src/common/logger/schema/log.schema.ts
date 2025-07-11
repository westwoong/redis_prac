import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export type LogDocument = Log & Document;
export enum LogLevel {
  error,
  warn,
  info,
  debug
}

export enum LogType {
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

  // HTTP 기본 정보
  @Prop()
  httpMethod?: string;

  @Prop()
  url?: string;

  @Prop()
  statusCode?: number;

  @Prop()
  errorMessage?: string;

  // IP 관련 정보
  @Prop()
  clientIp?: string; // 실제 클라이언트 IP

  @Prop()
  forwardedFor?: string; // X-Forwarded-For 헤더값

  @Prop()
  userAgent?: string; // 브라우저/클라이언트 정보

  @Prop()
  referer?: string; // 참조 페이지

  // 요청 상세 정보 (JSON으로 저장)
  @Prop({ type: Object })
  requestBody?: any; // 요청 본문

  @Prop({ type: Object })
  requestHeaders?: any; // 요청 헤더들

  @Prop({ type: Object })
  queryParams?: any; // 쿼리 파라미터

  @Prop({ type: Object })
  routeParams?: any; // 라우트 파라미터 (예: /users/:id의 id)

  // 응답 관련 정보
  @Prop()
  responseTime?: number; // 응답 시간 (ms)

  @Prop({ type: Object })
  responseBody?: any; // 응답 본문 (선택적, 민감한 정보 제외)

  // 추가 메타데이터
  @Prop()
  sessionId?: string; // 세션 ID

  @Prop()
  requestId?: string; // 요청 추적용 고유 ID

  @Prop({ type: Date, required: true, default: () => new Date(), expires: 60 * 60 * 24 * 7 }) // 7일 TTL (개발용에서 더 길게 변경)
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);