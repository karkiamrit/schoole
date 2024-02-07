import { Args, Mutation, Resolver, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput, SignUpInput } from './inputs/auth.input';
import { JwtWithUser } from '../auth/entities/auth._entity';
import { UseGuards } from '@nestjs/common';
import { SignInGuard } from '../modules/guards/graphql-signin-guard';
import { OtpType } from '../otp/entities/otp.entity';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from 'src/modules/decorators/user.decorator';
import { GraphqlPassportAuthGuard } from 'src/modules/guards/graphql-passport-auth.guard';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async SignUp(@Args('input') input: SignUpInput): Promise<User> {
    return await this.authService.signUp(input);
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

  @Mutation(() => Boolean)
  async forgotPassword(@Args('email') email: string): Promise<boolean> {
    const result = await this.authService.forgotPassword(email);
    return result;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ): Promise<boolean> {
    const result = await this.authService.resetPassword(token, newPassword);
    return result;
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

  @Mutation(() => Boolean)
  async verifyEmail(
    @Args('email') email: string,
    @Args('otpCode') otpCode: string,
  ): Promise<boolean> {
    const result = await this.authService.verifyEmail(email, otpCode);
    return result;
  }

  @Mutation(() => Boolean)
  async verifyPhone(
    @Args('phone') phone: string,
    @Args('otpCode') otpCode: string,
  ): Promise<boolean> {
    const result = await this.authService.verifyPhone(phone, otpCode);
    return result as boolean;
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
