import { UserDto } from "./UserDto";

export interface CommentDto {
  commentId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserDto;
}