import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export type PostDocument = Post & Document;

@Schema({ _id: false })
export class UserInfo {
  // mongoose.Schema.Types.ObjectId는 몽고디비의 오브젝트 아이디를 의미한다. (오브젝트 아이디란 몽고디비에서 유니크한 아이디를 의미한다 - Mysql로 따지면 PK다)
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true }) // required는 MYSQL에서 NOT NULL 조건과 같음
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  userName: string;
}

const UserInfoSchema = SchemaFactory.createForClass(UserInfo);

@Schema({
  timestamps: true, // 날짜 컬럼? 스키마? 자동 생성
  collection: "posts",
})
export class Post {
  @Prop({ type: UserInfoSchema, required: true })
  user: UserInfo;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  likeCount: number;

  // 위에서 설정한 timestamps: true를 하면 자동으로 생성된가 
  createdAt: Date;
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post); 