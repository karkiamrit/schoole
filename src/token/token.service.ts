// src/auth/token/TokenService.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(user: User): string {
    const accessTokenPayload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(accessTokenPayload);

    return accessToken;
  }

  generateRefreshToken(user: User): string {
    const refreshTokenPayload = {
      sub: user.id,
    };

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d', // Set the expiration time for refresh tokens as needed
    });

    user.refresh_token = refreshToken;
    user.save();

    return refreshToken;
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}
