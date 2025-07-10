import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { MongoPostRepository } from './mongoPost.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),    
  ],
  providers: [PostService, MongoPostRepository],
  controllers: [PostController]
})
export class PostModule {}
