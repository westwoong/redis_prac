import { Body, Controller, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './mongoPost.repository';
import { ConfigService } from '@nestjs/config';

@Controller('posts')
export class PostController {

    constructor(private readonly postService: PostService,
        private readonly configService: ConfigService,
    ) {
        console.log(this.configService.get('MONGODB_URL'));
    }

    @Post()
    async createPost(@Body() createPostDto: CreatePostDto) {
        return this.postService.createPost(createPostDto);
    }
}
