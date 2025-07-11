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

    async saveLog(logData: Log) {
        this.localLogger.log(logData);
        try {
            const logDataSetup = {
                ...logData,
                createdAt: new Date(),
            }
            const log = new this.logModel(logDataSetup);
            const result = await log.save();
            this.localLogger.log(`mongodb 저장 성공: ${result}`);
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
