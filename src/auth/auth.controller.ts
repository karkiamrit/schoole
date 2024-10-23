import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/oauth.guard';
import { JwtWithUser } from './entities/auth._entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // This route initiates the Google OAuth process
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    // This method is empty because the GoogleOauthGuard takes care of the redirect to Google
  }

  // This route handles the Google OAuth callback
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<JwtWithUser> {
    // The user profile from Google is attached to the request by the GoogleOauthGuard
    const user = req.user;

    // Handle business logic: register/login the user
    const {
      accessToken,
      refreshToken,
      user: authenticatedUser,
    } = await this.authService.handleGoogleAuth(user);

    // Optionally set tokens as cookies
    res.cookie('accessToken', accessToken, {
      maxAge: 2592000000, // 30 days
      sameSite: true,
      secure: false,
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: 2592000000, // 30 days
      sameSite: true,
      secure: false,
    });

    // Respond with tokens or redirect
    return { accessToken, refreshToken, user: authenticatedUser };
  }
}
