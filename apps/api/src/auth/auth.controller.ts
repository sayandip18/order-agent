import {
  Controller,
  Get,
  Req,
  Res,
  Session,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Session as ExpressSession } from 'express-session';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { UserResponseDto } from '../users/user-response.dto';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  // Initiates the Google OAuth flow
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin(): void {
    // Passport redirects automatically — no body needed
  }

  // Google redirects here after the user grants consent
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallback(
    @Req() req: Request,
    @Session() session: ExpressSession,
    @Res() res: Response,
  ): void {
    const user = req.user as User;
    session['userId'] = user.id;
    res.redirect(process.env.FRONTEND_URL ?? 'http://localhost:5173');
  }

  @Get('me')
  me(
    @Session() session: ExpressSession & { userId?: string },
    @Req() req: Request,
  ): UserResponseDto {
    const user = req.user as User | undefined;
    if (!session.userId && !user) {
      throw new UnauthorizedException();
    }
    // req.user is populated when a session userId exists (see AuthModule setup)
    return UserResponseDto.from(user!);
  }

  @Get('logout')
  logout(@Session() session: ExpressSession, @Res() res: Response): void {
    session.destroy(() => {
      res.redirect(process.env.FRONTEND_URL ?? 'http://localhost:5173');
    });
  }
}
