import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { MongoPostRepository } from './mongoPost.repository';
import { LoggerService } from 'src/common/logger/logger.service';
import { Log, LogSchema } from 'src/common/logger/schema/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  providers: [PostService, MongoPostRepository, LoggerService],
  controllers: [PostController]
})
export class PostModule {}
