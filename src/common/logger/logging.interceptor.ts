import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { LogLevel, LogType } from './schema/log.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  // 민감한 정보 필터링용 키워드들
  private readonly sensitiveFields = [
    'password', 'pwd', 'passwd', 'secret', 'token', 'authorization', 
    'cookie', 'session', 'credit', 'card', 'ssn', 'social'
  ];

  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // HTTP 요청/응답 정보 추출
    const request = context.switchToHttp().getRequest();
    console.log(request);
    const response = context.switchToHttp().getResponse();
    console.log(response);
    
    // 요청 시작 시간 기록
    const startTime = Date.now();
    
    // 고유 요청 ID 생성 (추적용)
    const requestId = uuidv4();
    
    // 요청 정보 수집
    const requestInfo = this.extractRequestInfo(request, requestId);
    
    this.logger.log(`📥 [${requestId}] ${requestInfo.method} ${requestInfo.url} - 요청 시작`);

    return next.handle().pipe(
      // 성공 응답 처리
      tap(async (responseData) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const statusCode = response.statusCode;

        // 성공 로그를 MongoDB에 저장
        await this.loggerService.saveLog({
          errorLevel: LogLevel.info,
          message: `${requestInfo.method} ${requestInfo.url} - 성공 (${responseTime}ms)`,
          type: LogType.request,
          
          // HTTP 기본 정보
          httpMethod: requestInfo.method,
          url: requestInfo.url,
          statusCode: statusCode,
          
          // IP 및 클라이언트 정보
          clientIp: requestInfo.clientIp,
          forwardedFor: requestInfo.forwardedFor,
          userAgent: requestInfo.userAgent,
          referer: requestInfo.referer,
          
          // 요청 상세 정보
          requestBody: requestInfo.body,
          requestHeaders: requestInfo.headers,
          queryParams: requestInfo.queryParams,
          routeParams: requestInfo.routeParams,
          
          // 응답 정보
          responseTime: responseTime,
          responseBody: this.filterSensitiveData(responseData), // 응답 본문도 저장 (민감한 정보 제외)
          
          // 메타데이터
          requestId: requestId,
          sessionId: requestInfo.sessionId,
          
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        this.logger.log(`✅ [${requestId}] ${requestInfo.method} ${requestInfo.url} - ${statusCode} (${responseTime}ms)`);
      }),

      // 에러 응답 처리
      catchError(async (error) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const statusCode = error.status || 500;

        // 에러 로그를 MongoDB에 저장
        await this.loggerService.saveLog({
          errorLevel: LogLevel.error,
          message: `${requestInfo.method} ${requestInfo.url} - 에러 발생 (${responseTime}ms)`,
          type: LogType.error,
          
          // HTTP 기본 정보
          httpMethod: requestInfo.method,
          url: requestInfo.url,
          statusCode: statusCode,
          errorMessage: error.message || '알 수 없는 에러',
          
          // IP 및 클라이언트 정보
          clientIp: requestInfo.clientIp,
          forwardedFor: requestInfo.forwardedFor,
          userAgent: requestInfo.userAgent,
          referer: requestInfo.referer,
          
          // 요청 상세 정보
          requestBody: requestInfo.body,
          requestHeaders: requestInfo.headers,
          queryParams: requestInfo.queryParams,
          routeParams: requestInfo.routeParams,
          
          // 응답 정보
          responseTime: responseTime,
          
          // 메타데이터
          requestId: requestId,
          sessionId: requestInfo.sessionId,
          
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        this.logger.error(`❌ [${requestId}] ${requestInfo.method} ${requestInfo.url} - ${statusCode} (${responseTime}ms): ${error.message}`);
        
        // 에러를 다시 던져서 정상적인 에러 처리 플로우 유지
        throw error;
      })
    );
  }

  /**
   * 요청에서 모든 필요한 정보를 추출하는 함수
   */
  private extractRequestInfo(request: any, requestId: string) {
    // IP 주소 추출 (프록시 환경 고려)
    const clientIp = this.getClientIp(request);
    const forwardedFor = request.headers['x-forwarded-for'] || 
                        request.headers['x-real-ip'] || 
                        request.headers['x-client-ip'];

    return {
      method: request.method,
      url: request.url,
      
      // IP 정보
      clientIp,
      forwardedFor,
      
      // 클라이언트 정보
      userAgent: request.headers['user-agent'] || 'Unknown',
      referer: request.headers['referer'] || request.headers['referrer'],
      
      // 요청 데이터 (민감한 정보 필터링)
      body: this.filterSensitiveData(request.body),
      headers: this.filterSensitiveHeaders(request.headers),
      queryParams: request.query || {},
      routeParams: request.params || {},
      
      // 세션 정보
      sessionId: request.sessionID || request.session?.id,
    };
  }

  /**
   * 클라이언트의 실제 IP 주소를 추출 (프록시 환경 고려)
   */
  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.headers['x-real-ip'] ||
      request.headers['x-client-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      'Unknown'
    );
  }

  /**
   * 민감한 정보를 필터링하는 함수 (순환 참조 방지)
   */
  private filterSensitiveData(data: any, visited: WeakSet<object> = new WeakSet()): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // 순환 참조 방지 - 이미 방문한 객체면 참조 표시만 남김
    if (visited.has(data)) {
      return '[Circular Reference]';
    }
    visited.add(data);

    if (Array.isArray(data)) {
      return data.map(item => this.filterSensitiveData(item, visited));
    }

    const filtered = {};
    
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const lowerKey = key.toLowerCase();
        
        // 민감한 필드인지 확인
        if (this.sensitiveFields.some(field => lowerKey.includes(field))) {
          filtered[key] = '[FILTERED]';
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          filtered[key] = this.filterSensitiveData(data[key], visited);
        } else {
          filtered[key] = data[key];
        }
      }
    }
    
    return filtered;
  }

  /**
   * 민감한 헤더 정보를 필터링하는 함수
   */
  private filterSensitiveHeaders(headers: any): any {
    const filtered = { ...headers };
    
    // 민감한 헤더들 필터링
    const sensitiveHeaders = ['authorization', 'cookie', 'set-cookie', 'x-api-key'];
    
    for (const header of sensitiveHeaders) {
      if (filtered[header]) {
        filtered[header] = '[FILTERED]';
      }
    }
    
    return filtered;
  }
} 