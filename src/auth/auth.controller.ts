import {
  Controller,
  Get,
  Res,
  Req,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
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

    // Handle business logic: register/login the user
    const { accessToken, refreshToken } =
      await this.authService.handleGoogleAuth(user);

    const authorizationCode = uuidv4();
    await this.authService.storeAuthorizationCode(authorizationCode, {
      accessToken,
      refreshToken,
    });
    const returnUrl =
      this.configService.get('CLIENT_URI') + `?code=${authorizationCode}`;
    res.redirect(`${returnUrl}`);
  }

  @Post('exchange-code')
  async exchangeCode(@Body() body: { code: string }) {
    const { code } = body;
    const tokens = await this.authService.exchangeAuthorizationCode(code);

    if (!tokens) {
      return { message: 'Invalid or expired authorization code' };
    }

    return { tokens };
  }
}
