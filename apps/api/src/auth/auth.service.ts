import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async findOrCreateUser(profile: GoogleProfile): Promise<User> {
    const existing = await this.usersService.findByGoogleId(profile.googleId);
    if (existing) {
      return existing;
    }
    return this.usersService.create({
      googleId: profile.googleId,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl ?? '',
    });
  }
}
