import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post, PostDocument } from './schema/post.schema';

export interface CreatePostDto {
    userId: string;
    userName: string;
    title: string;
    content: string;
}

@Injectable()
export class MongoPostRepository {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
    ) { }

    async createPost(createPostDto: CreatePostDto): Promise<Post> {
        const { userId, userName, title, content } = createPostDto;

        if (typeof userId === 'string') {
            throw new BadRequestException('userId = number만 가능');
        }

        const newPost = new this.postModel({
            user: {
                userId: new mongoose.Types.ObjectId(userId),
                userName
            },
            title,
            content,
        });

        return newPost.save();
    }

    async deletePost(postObjectId: string) {
        try {
            const post = await this.postModel.findByIdAndDelete(postObjectId);
            if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
            console.log(`postObjectId: ${postObjectId} 게시글 삭제 진행\n ${post}`);
            return {
                deleted: true,
                post
            };
        } catch (error) {
            throw new BadRequestException('게시글 삭제 실패');
        }
    }
} 