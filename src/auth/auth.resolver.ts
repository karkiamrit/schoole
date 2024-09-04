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
import { SignInGuard } from '../modules/guards/graphql-signin-guard';
import { OtpType } from '../otp/entities/otp.entity';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from 'src/modules/decorators/user.decorator';
import { GraphqlPassportAuthGuard } from 'src/modules/guards/graphql-passport-auth.guard';
import { Response } from 'express';
import { ApolloError } from 'apollo-server-core';

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
  @UseGuards(SignInGuard)
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
  async requestOtpVerifyPhone(
    @Args('phone') phone: string,
    @Args('otpType') otpType: OtpType,
  ): Promise<boolean> {
    return await this.authService.requestOtpVerifyPhone(phone, otpType);
  }

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

  @Mutation(() => OnlyJwt)
  async verifyPhone(
    @Args('phone') phone: string,
    @Args('otpCode') otpCode: string,
    @Context() { res }: { res: Response },
  ): Promise<OnlyJwt> {
    const { accessToken, refreshToken } = await this.authService.verifyPhone(
      phone,
      otpCode,
    );
    res.cookie('access_token', accessToken, { httpOnly: true }); // Set the cookie
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    return { accessToken, refreshToken };
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
      console.log(res.get('access_token'));
    }
    return success;
  }
}
