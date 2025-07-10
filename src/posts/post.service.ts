import { Injectable } from '@nestjs/common';
import { CreatePostDto, MongoPostRepository } from './mongoPost.repository';

@Injectable()
export class PostService {
    constructor(private readonly postRepository: MongoPostRepository) {}

    async createPost(createPostDto: CreatePostDto) {
        return this.postRepository.create(createPostDto);
    }
}
