import jwt, { SignOptions, TokenExpiredError } from 'jsonwebtoken';

import { User } from '@/user/entities/user.entity';
import { TokenRepository } from './token.repository';
import { Token } from './entities/token.entity';
import {
  REFRESH_TOKEN_SECRECT,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
} from '@/util/config/config';
import { JwtPayload } from 'jsonwebtoken';
import { UserRepository } from '../user/user.repository';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepo: TokenRepository,
    private readonly userRepo: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  private readonly BASE_OPTIONS: SignOptions = {
    issuer: 'schoole',
    audience: 'schoole',
  };

  /**
   * It creates a refresh token in database, then sign it with JWT
   * @param {User} user - The user object that we want to generate token for
   * @param {number} expiresIn - The number of seconds the token will be valid for
   * @returns A refresh token
   */
  async createRefreshToken(user: User, expiresIn: number): Promise<string> {
    const token = await this.tokenRepo.createToken(user, expiresIn);
    console.log(token);
    const options: SignOptions = {
      ...this.BASE_OPTIONS,
      subject: String(user.id),
      jwtid: String(token.id),
      expiresIn,
      algorithm: 'HS256',
    };
    const refreshToken = jwt.sign(
      {},
      this.configService.get('REFRESH_TOKEN_SECRECT'),
      options,
    );
    return refreshToken;
  }

  /**
   * It creates an access token and sign it with JWT
   * @param user - The user object that we want to generate token for
   * @param expiresIn - The number of seconds the token will be valid for
   * @returns
   */
  async createAccessToken(user: User, expiresIn: number): Promise<string> {
    const options: SignOptions = {
      ...this.BASE_OPTIONS,
      subject: String(user.id),
      expiresIn,
      algorithm: 'HS256',
    };

    const accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, options);
    return accessToken;
  }

  /**
   * It resolves the refresh token to a user, then create access token for that user
   * @param {string} refreshToken - Refresh token that was sent to client
   * @returns {user: User, token: string}
   */
  async createAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    const { user } = await this.resolveRefreshToken(refreshToken);

    return await this.createAccessToken(user, Number(ACCESS_TOKEN_EXPIRY));
  }

  /**
   * It decodes the refresh token, find the token and user from database and return them
   * @param {string} accessToken - The decoded access token
   * @returns An object with a user and token
   */
  async resolveRefreshToken(
    accessToken: string,
  ): Promise<{ user: User; token: Token }> {
    const payload = await this.decodeRefreshToken(accessToken);

    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);
    if (!token) {
      throw new Error('malformed');
    }
    if (token.is_revoked) {
      throw new Error('revoked');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);
    if (!user) {
      throw new Error('malformed');
    }

    return { user, token };
  }

  /**
   * It verifies the refresh token and throws an error if the token is expired or malformed
   * @param {string} token - The decoded refresh token
   * @returns The payload of the token
   */
  async decodeRefreshToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, REFRESH_TOKEN_SECRECT, (err, payload) => {
        if (err) {
          reject(
            err instanceof TokenExpiredError
              ? new Error('expired')
              : new Error('malformed'),
          );
        }
        resolve(payload as JwtPayload);
      });
    });
  }

  /**
   * It verifies the access token and throws an error if the token is expired or malformed
   * @param {string} token - The decoded access token
   * @returns The payload of the token
   */
  async decodeAccessToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
          reject(
            err instanceof TokenExpiredError
              ? new Error('expired')
              : new Error('malformed'),
          );
        }
        resolve(payload as JwtPayload);
      });
    });
  }

  /**
   * It takes a refresh token payload, extracts the user ID from the payload, and uses that user ID to
   * find the corresponding user in the database
   * @param {JwtPayload} payload - A payload of the token
   * @returns A user or null object
   */
  async getUserFromRefreshTokenPayload(
    payload: JwtPayload,
  ): Promise<User | null> {
    const subId = Number(payload.sub);

    if (!subId) {
      throw new Error('malformed');
    }

    return await this.userRepo.findOne({
      where: {
        id: subId,
      },
    });
  }

  /**
   * It takes a refresh token payload, extracts the token ID from the payload, and uses that token ID to
   * find the corresponding refresh token in the database
   * @param {JwtPayload} payload - A payload of the token
   * @returns A token or null object
   */
  async getStoredTokenFromRefreshTokenPayload(
    payload: JwtPayload,
  ): Promise<Token | null> {
    const tokenId = Number(payload.jti);

    if (!tokenId) {
      throw new Error('malformed');
    }

    return await this.tokenRepo.findTokenById(tokenId);
  }

  /**
   * It deletes the refresh token from the database and returns a boolean value
   * @param {User} user - The user object that is currently logged in
   * @param {JwtPayload} payload - The payload of the refresh token
   * @returns - A boolean value
   */
  async deleteRefreshToken(user: User, payload: JwtPayload): Promise<boolean> {
    const tokenId = payload.jti;

    if (!tokenId) {
      throw new Error('malformed');
    }

    return await this.tokenRepo.deleteToken(user, Number(tokenId));
  }

  /**
   * It deletes all the refresh tokens from the database and returns a boolean value
   * @param {User} user - The user object that is returned from @CurrentUser decorator
   * @returns - A boolean value
   */
  async deleteRefreshTokensForUser(user: User): Promise<boolean> {
    return await this.tokenRepo.deleteTokensForUser(user);
  }
}
