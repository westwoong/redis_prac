import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Log } from './schema/log.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LoggerService {
    private readonly localLogger = new Logger(LoggerService.name);
    constructor(
        @InjectModel(Log.name)
        private readonly logModel: Model<Log>
    ) {}

    async saveLog(logData: Partial<Log>): Promise<boolean> {
        try {
            const logDataWithDefaults = {
                ...logData,
                createdAt: logData.createdAt || new Date(),
                updatedAt: logData.updatedAt || new Date(),
            };

            this.localLogger.log(logDataWithDefaults);

            const log = new this.logModel(logDataWithDefaults);
            const result = await log.save();            
            this.localLogger.debug(`MongoDB 로그 저장 성공 - ID: ${result._id}`);
            return true;
        } catch (error) {
            this.localLogger.error(`MongoDB 로그 저장 실패: ${error.message}`, error.stack);
            return false;
        }
    }
}
