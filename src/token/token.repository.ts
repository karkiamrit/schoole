import { Injectable } from '@nestjs/common';
import { Token } from './entities/token.entity';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class TokenRepository {
  /**
   * It creates the new refresh token for a given user and expiration time
   * @param {User} user - The user that a token is being created for
   * @param {number} ttl - The time to live of the token in seconds
   * @returns A token object
   */
  async createToken(user: User, ttl: number): Promise<Token> {
    const expiresIn = new Date();

    // // the input is treated as millis so *1000 is necessary
    // const ttlSeconds = ttl * 1000;

    // expiresIn.setTime(expiresIn.getTime() + ttlSeconds);

    const token: Token = await Token.create({
      user,
      expires_in: expiresIn,
    }).save();
    return token;
  }

  /**
   * It finds the token by its id and returns a token
   * @param {id} id - The id of the token to be found
   * @returns The token object
   */
  async findTokenById(id: number): Promise<Token | null> {
    return await Token.findOneBy({ id });
  }

  /**
   * It deletes a refresh token by setting its 'isRevoked' to 'true'
   * @param {User} user - The user object that is currently logged in
   * @param {number} tokenId - The ID of the token to be deleted
   * @returns - A boolean value
   */
  async deleteToken(user: User, tokenId: number): Promise<boolean> {
    return (
      (await Token.update(
        { user: { id: user.id }, id: tokenId },
        { is_revoked: true },
      )) !== null
    );
  }

  /**
   * It deletes all refresh tokens by setting its 'isRevoked' to 'true'
   * @param {User} user - The user object that is currently logged in
   * @returns - A boolean value
   */
  async deleteTokensForUser(user: User): Promise<boolean> {
    return (
      (await Token.update({ user: { id: user.id } }, { is_revoked: true })) !==
      null
    );
  }
}
