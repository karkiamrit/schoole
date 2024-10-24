import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/oauth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // This route initiates the Google OAuth process
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    // This method is empty because the GoogleOauthGuard takes care of the redirect to Google
  }

  // This route handles the Google OAuth callback
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: any) {
    // The user profile from Google is attached to the request by the GoogleOauthGuard
    const user = req.user;
    console.log(req.user, 'req.user');

    // Handle business logic: register/login the user
    const { accessToken, refreshToken } =
      await this.authService.handleGoogleAuth(user);

    // Optionally set tokens as cookies
    res.cookie('accessToken', accessToken, {
      maxAge: 2592000000, // 30 days
      sameSite: false,
      secure: false,
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: 2592000000, // 30 days
      sameSite: false,
      secure: false,
    });

    const returnUrl = this.configService.get('CLIENT_URI');
    res.redirect(
      `${returnUrl}?accessToken=${accessToken}&refreshToken=${refreshToken}`,
      301,
    );
  }
}
