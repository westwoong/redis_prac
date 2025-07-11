import { Injectable } from '@nestjs/common';
import { CreatePostDto, MongoPostRepository } from './mongoPost.repository';
import { LoggerService } from 'src/common/logger/logger.service';
import { LogLevel, LogType } from 'src/common/logger/schema/log.schema';

@Injectable()
export class PostService {
    constructor(
        private readonly postRepository: MongoPostRepository,
        private readonly loggerService: LoggerService
    ) { }

    async createPost(createPostDto: CreatePostDto) {
        const { userId, userName, title, content } = createPostDto;
        this.loggerService.saveLog({
            message: `게시글 생성 userId: ${userId} userName: ${userName} title: ${title} content: ${content}`,
            type: LogType.business,
            userId: Number(userId),
            errorLevel: LogLevel.info,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return this.postRepository.createPost(createPostDto);
    }

    async deletePost(postObjectId: string) {
        return this.postRepository.deletePost(postObjectId);
    }
}
