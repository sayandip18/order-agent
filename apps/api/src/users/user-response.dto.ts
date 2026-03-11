import { User } from './user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;

  static from(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.avatarUrl = user.avatarUrl;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
