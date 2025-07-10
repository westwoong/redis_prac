import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Log } from './schema/log.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LoggerService {
    constructor(
        @InjectModel(Log.name)
        private readonly logModel: Model<Log>
    ) {}

    async saveLog(logData: Log) {
        try {
            const KST_TIME = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
            const logDataSetup = {
                ...logData,
                createdAt: KST_TIME,
            }
            const log = new this.logModel(logDataSetup);
            await log.save();
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
