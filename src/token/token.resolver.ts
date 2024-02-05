// src/auth/token/TokenResolver.ts
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { TokenService } from './token.service';
import { Response } from 'express';

@Resolver('Token')
export class TokenResolver {
  constructor(private readonly tokenService: TokenService) {}

  @Mutation(() => String)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
    @Context() { res }: { res: Response },
  ): Promise<string> {
    const decodedToken = this.tokenService.verifyToken(refreshToken);

    // Generate a new access token
    const newAccessToken = this.tokenService.generateAccessToken(
      decodedToken.user,
    );
    res.cookie('access_token', newAccessToken, { httpOnly: true });

    return newAccessToken;
  }
}
