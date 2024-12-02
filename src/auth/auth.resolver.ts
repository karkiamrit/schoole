import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  ForgotPasswordInput,
  SignInInput,
  SignInWithEmailInput,
  SignUpInput,
  SignUpWithEmailInput,
} from './inputs/auth.input';
import { JwtWithUser, OnlyJwt } from '@/auth/entities/auth._entity';
import { UseGuards } from '@nestjs/common';
import { Otp, OtpType } from '@/otp/entities/otp.entity';
import { User } from '@/user/entities/user.entity';
import { CurrentUser } from 'src/modules/decorators/user.decorator';
import { GraphqlPassportAuthGuard } from 'src/modules/guards/graphql-passport-auth.guard';
import { Response } from 'express';
import { ApolloError } from 'apollo-server-core';
import { ChangePasswordInput } from '@/user/inputs/user.input';
import { GoogleOauthGuard } from './guards/oauth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async SignUp(@Args('input') input: SignUpInput): Promise<User> {
    return await this.authService.signUp(input);
  }

  @Mutation(() => User)
  async SignUpWithEmail(
    @Args('input') input: SignUpWithEmailInput,
  ): Promise<User> {
    return await this.authService.signUpWithEmail(input);
  }

  @Mutation(() => JwtWithUser)
  // @UseGuards(SignInGuard)
  async signIn(
    @Args('input') input: SignInInput,
    @Context() { res }: { res: Response },
  ): Promise<JwtWithUser> {
    const result = await this.authService.signIn(input);
    res.cookie('access_token', result.accessToken, { httpOnly: true }); // Set the cookie
    res.cookie('refresh_token', result.refreshToken, { httpOnly: true });
    return result;
  }

  @Mutation(() => JwtWithUser)
  // @UseGuards(SignInGuard)
  async signInWithEmail(
    @Args('input') input: SignInWithEmailInput,
    @Context() { res }: { res: Response },
  ): Promise<JwtWithUser> {
    const result = await this.authService.SignInWithEmail(input);
    res.cookie('access_token', result.accessToken, { httpOnly: true }); // Set the cookie
    res.cookie('refresh_token', result.refreshToken, { httpOnly: true });
    return result;
  }

  @Mutation(() => JwtWithUser)
  @UseGuards(GoogleOauthGuard)
  async signInWithGoogle(@Context() { res }: { res: Response }) {
    const user = res.locals.user; // OAuth'd user from the Google strategy

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

    return { user: authenticatedUser, accessToken, refreshToken };
  }

  @Mutation(() => Boolean)
  @UseGuards(new GraphqlPassportAuthGuard())
  async changePassword(
    @Args('input') input: ChangePasswordInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const { oldPassword, newPassword } = input;
    return this.authService.updatePassword(oldPassword, newPassword, user);
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Args('data') data: ForgotPasswordInput,
  ): Promise<boolean> {
    if (data.method === 'email') {
      return await this.authService.forgotPasswordWithEmail(data.input);
    }
    return await this.authService.forgotPasswordWithPhone(data.input);
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ): Promise<boolean> {
    return await this.authService.resetPassword(token, newPassword);
  }

  @Mutation(() => Boolean)
  async requestOtpVerifyEmail(
    @Args('email') email: string,
    @Args('otpType') otpType: OtpType,
  ): Promise<boolean> {
    return await this.authService.requestOtpVerifyEmail(email, otpType);
  }

  @Mutation(() => Boolean)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  async requestOtpReverifyEmail(
    @CurrentUser() user: User,
    @Args('email') email: string,
    @Args('otpType') otpType: OtpType,
  ): Promise<boolean> {
    return await this.authService.requestReverifyEmailOtp(user, email, otpType);
  }

  @Mutation(() => Boolean)
  async requestOtpVerifyPhone(
    @Args('phone') phone: string,
    @Args('otpType') otpType: OtpType,
  ): Promise<boolean> {
    return await this.authService.requestOtpVerifyPhone(phone, otpType);
  }

  // used in client side
  @Mutation(() => OnlyJwt)
  async verifyEmail(
    @Args('email') email: string,
    @Args('otpCode') otpCode: string,
    @Context() { res }: { res: Response },
  ): Promise<OnlyJwt> {
    const result = await this.authService.verifyEmail(email, otpCode);
    res.cookie('access_token', result.accessToken, { httpOnly: true }); // Set the cookie
    res.cookie('refresh_token', result.refreshToken, { httpOnly: true });
    return result;
  }

  // used in client side for reverification of email
  @Mutation(() => Otp)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  async reverifyEmail(
    @CurrentUser() user: User,
    @Args('email') email: string,
    @Args('otpCode') otpCode: string,
  ): Promise<Otp> {
    return await this.authService.reverifyEmail(user, email, otpCode);
  }

  @Mutation(() => OnlyJwt)
  async verifyPhone(
    @Args('phone') phone: string,
    @Args('otpCode') otpCode: string,
    @Context() { res }: { res: Response },
  ): Promise<JwtWithUser> {
    const { accessToken, refreshToken, user } =
      await this.authService.verifyPhone(phone, otpCode);
    res.cookie('access_token', accessToken, { httpOnly: true }); // Set the cookie
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    return { accessToken, refreshToken, user };
  }

  @Mutation(() => String)
  async verifyForgotPasswordOtp(
    @Args('phone') phone: string,
    @Args('otpCode') otpCode: string,
  ): Promise<string> {
    const response_token = await this.authService.validateResetPasswordOtp(
      phone,
      otpCode,
    );
    if (response_token) {
      return response_token;
    } else {
      throw new ApolloError('Invalid OTP Code', 'OTP_NOT_FOUND_OR_EXPIRED', {
        statusCode: 404,
      });
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  async logout(
    @CurrentUser() user: User,
    @Context() { res }: { res: Response },
  ): Promise<boolean> {
    const success = await this.authService.logout(user);
    if (success) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
    }
    return success;
  }

  @Mutation(() => JwtWithUser)
  // @UseGuards(SignInGuard)
  async signInAdmin(
    @Args('input') input: SignInWithEmailInput,
    @Context() { res }: { res: Response },
  ): Promise<JwtWithUser> {
    const result = await this.authService.signInAdmin(input);
    res.cookie('access_token', result.accessToken, { httpOnly: true }); // Set the cookie
    res.cookie('refresh_token', result.refreshToken, { httpOnly: true });
    return result;
  }


  @Mutation(() => Boolean)
  async  sendEmailVerificationMail(
    @Args('email') email: string,
  ): Promise<boolean> {
    const result  = await  this.authService.sendEmailVerificationMail(email)
    return  true
  }


  @Mutation(() => Boolean)
  async validateVerificationMail (
    @Args('token') token: string,
  ): Promise<User> {
    return  this.authService.validateVerificationEmail(token);
  }
}
