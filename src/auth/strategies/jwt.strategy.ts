import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request as RequestType } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('JWT_ACCESS_PUBLIC_KEY'),
    });
  }

  private static extractJWT(req: RequestType): string | null {
    if (
      req.cookies &&
      'access_token' in req.cookies &&
      req.cookies.access_token.length > 0
    ) {
      return req.cookies.access_token;
    }
  }

  async validate(payload: any, done: VerifiedCallback) {
    try {
      const userData = await this.userService.getOne({
        where: { id: payload.sub },
      });

      if (!userData) {
        throw new UnauthorizedException('User not found');
      }
      done(null, userData);
    } catch (err) {
      throw new UnauthorizedException('Error', err.message);
    }
  }
}
