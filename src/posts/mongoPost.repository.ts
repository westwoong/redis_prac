import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schema/post.schema';
import * as mongoose from 'mongoose';

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

    async create(createPostDto: CreatePostDto): Promise<Post> {
        const { userId, userName, title, content } = createPostDto;

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
} 