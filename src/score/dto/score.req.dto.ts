import { IsInt, IsNotEmpty, IsNumber } from "class-validator";

export class ScoreRequestDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number

  @IsNotEmpty()
  @IsInt()
  score: number
}