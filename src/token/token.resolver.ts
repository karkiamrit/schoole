// src/auth/token/TokenResolver.ts
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { TokenService } from './token.service';
import { Response } from 'express';
import { UserService } from '@/user/user.service';

@Resolver('Token')
export class TokenResolver {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}
  @Mutation(() => String)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
    @Context() { res }: { res: Response },
  ): Promise<string> {
    const decodedToken = this.tokenService.verifyToken(refreshToken);
    const user = await this.userService.getOne({
      where: { id: decodedToken.sub },
    });
    // Generate a new access token
    const newAccessToken = this.tokenService.generateAccessToken(user);
    res.cookie('access_token', newAccessToken, { httpOnly: true });

    return newAccessToken;
  }
}
