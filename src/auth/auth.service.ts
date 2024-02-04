import { UserService } from '../user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInInput, SignUpInput } from 'src/auth/inputs/auth.input';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { User } from '../user/entities/user.entity';
import { JwtWithUser } from './inputs/auth.response';
import { OtpService } from '../otp/otp.service';
import { MailService } from '../mail/mail.service';
import { FULL_WEB_URL } from 'src/util/config/config';
import { OtpType } from 'src/otp/entities/otp.entity';
import { TokenService } from 'src/token/token.service';
import { ApolloError } from 'apollo-server-core';
import { Http } from 'src/util/http';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    /**
     *Create authentication and user-related functionalities.
     *UserService: Manages user-related operations.
     *OtpService: Handles OTP generation and verification.
     *MailService: Sends emails for OTP, password reset, and email verification.
     *TokenService: Deals with token-related operations.
     *Http: Utility for making HTTP requests.
     */

    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly http: Http,
    private readonly configService: ConfigService,
  ) {}

  /** Generates a unique identifier using the crypto module.
   * @returns {string}-  A hexadecimal string representing the unique identifier.
   */

  private generateUniqueIdentifier(): string {
    const uniqueIdentifier = crypto.randomBytes(16).toString('hex');
    return uniqueIdentifier;
  }

  /**
   * Generates a JWT intended for the reset password functionality.
   * @param   {User} user  - An object representing the user for whom the password reset token is being generated.
   * @returns {string} - A signed JWT string containing user-related claims for the password reset process.
   */

  /**
   * Registers the new user with provided Information and checks if the user already exists or not.
   * @returns Returns a newly created user.
   * @param input
   */

  async signUp(input: SignUpInput): Promise<User> {
    const { phone } = input;
    const user = await this.userService.getOne({ where: { phone } });
    if (user) {
      throw new ApolloError('User already exist', 'USER_ALREADY_EXISTS', {
        statusCode: 409, // Conflict status code for a resource conflict
      });
    }
    const passwordUnhashed = this.generateUniqueIdentifier();
    // hash password using bcryptjs
    const password = await bcrypt.hash(passwordUnhashed, 12);

    return await this.userService.create(_.merge(input, { phone, password }));
  }

  /**
   * Initiates the process of sending a One-Time Password (OTP) to the user's email for verification.
   * @param {string}email -Email address of the user for whom the OTP is requested.
   * @param {OtpType}otpType- An enumeration specifying the type of OTP (e.g., "EMAIL", "PHONE").
   * @returns  boolean if the operation is successful.
   */
  async requestOtpVerify(phone: string, otpType: OtpType): Promise<boolean> {
    const user = await this.userService.getOne({
      where: {
        phone: phone,
      },
    });
    if (!user) throw new ApolloError('Invalid phone number!');

    const otp = await this.otpService.create(user, otpType);

    const message = `Your OTP for ${otpType.toLowerCase()} is ${otp.code}`;
    await this.http.sendSms(phone, message);

    return true;
  }

  /**
   * It finds USER by phone number and OTP by (otp code, user & operation type), It then
   * throws error if OTP is invalid, expired or already used. If data is valid then update
   * phone number as verified
   * @param {string} phone - The phone number which we are verifying
   * @param {string} otpCode - The OTP code which was sent to user for phone number verification
   * @returns A boolean value
   */
  async verifyPhone(phone: string, otpCode: string): Promise<Boolean> {
    const user = await this.userService.getOne({
      where: {
        phone: phone,
      },
    });
    if (!user) throw new ApolloError('Invalid phone number!');

    // TODO: for testing, remove when done
    if (otpCode === '123456') {
      return !!(await this.userService.updateVerification(user.id, {
        phone_verified: true,
      }));
    }

    const otp = await this.otpService.getOne(
      otpCode,
      user,
      OtpType.PHONE_VERIFY,
    );

    return !!(await this.otpService.update(
      _.merge(otp, {
        is_used: true,
        user: _.assign(user, { phone_verified: true, phone }),
      }),
    ));
  }

  /**
   * Authenticates a user based on the provided email address.
   * @param  {SignInInput} input -An object containing the user's email and password for authentication.
   * @returns Returns an object containing the authenticated user details and a signed JWT.
   */
  async signIn(input: SignInInput): Promise<JwtWithUser> {
    const user = await this.checkInputParameters(input);
    if (!user) {
      throw new ApolloError("User doesn't exist", 'USER_NOT_FOUND', {
        statusCode: 404, // Not Found
      });
    }
    user.last_login = new Date(); //update last login to current timestamp
    await this.userService.update(user.id, user); //update user with updated last login
    const refreshToken = await this.tokenService.createRefreshToken(
      user,
      Number(this.configService.get('REFRESH_TOKEN_EXPIRY')),
    );
    const accessToken = await this.tokenService.createAccessToken(
      user,
      Number(this.configService.get('ACCESS_TOKEN_EXPIRY')),
    );
    return { user, refreshToken, accessToken };
  }

  /**
   * Initiates the password reset process.
   * @returns  user if email or phone is provided and correct
   */
  private async checkInputParameters(input: SignInInput) {
    let user: User;
    if (input.email) {
      user = await this.userService.getOne({
        where: { email: input.email },
      });
    } else if (input.phone) {
      user = await this.userService.getOne({
        where: { phone: input.phone },
      });
    } else {
      throw new BadRequestException('Email or phone is required');
    }
    return user;
  }

  /**
   * Initiates the password reset process.
   * @param  {string} email -The email address of the user for whom the password reset is requested.
   * @returns  Boolean if the operation is successful.
   */

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.userService.getOne({ where: { email } });
    if (!user) {
      throw new ApolloError("Email doesn't exist!", 'EMAIL_NOT_FOUND', {
        statusCode: 404, // Not Found
      });
    }
    const otp = await this.otpService.create(user, OtpType.EMAIL_VERIFY);

    return !!(await this.mailService.sendResetPasswordLink(email, otp.code));
  }

  /**
   * It finds the user by email from database and update the hashed password
   * @param {string} email - The email which we are verifying and sending OTP
   * @param {string} otpCode - The OTP code that was sent to the user email
   * @param {string} password - The new password from an user
   * @returns A boolean value
   */
  async resetPassword(
    email: string,
    otpCode: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.userService.getOne({
      where: {
        email: email,
      },
    });
    if (!user) throw new ApolloError("Phone number doesn't exist!");

    let otp = await this.otpService.getOne(
      otpCode,
      user,
      OtpType.RESET_PASSWORD,
    );

    const hashPassword = await bcrypt.hash(password, 12);

    return !!(await this.otpService.update(
      _.assign(otp, {
        is_used: true,
        user: _.assign(user, { password: hashPassword }),
      }),
    ));
  }

  // /**
  //  * Verifies the user's email by checking the validity of the provided OTP code.
  //  * @param {string} email -Email address of the user for whom email verification is requested.
  //  * @param {string} otpCode-The OTP code provided by the user for verification.
  //  * @returns Boolean if the email verification is successful.
  //  */

  // async verifyPhone(phone: string, otpCode: string): Promise<boolean> {
  //   try {
  //     const user = await this.userService.getOne({ where: { phone } });
  //     if (!user) {
  //       throw new BadRequestException('User not found');
  //     }

  //     // Send the reset password link to the user's phone
  //     if (user.phone_verified) {
  //       throw new BadRequestException('Phone already verified');
  //     }

  //     // Verify the OTP code with the user's OTP
  //     const otp = await this.otpService.getOne(
  //       otpCode,
  //       user,
  //       OtpType.PHONE_VERIFY,
  //     );

  //     if (!otp) {
  //       throw new BadRequestException('Invalid OTP');
  //     }
  //     // Implement OTP verification logic here
  //     // Retrieve the OTP associated with the user and check if it matches otpCode

  //     // If the OTP is valid, set user.phone_verified to true and update the user
  //     await this.userService.updateVerification(user.id, {
  //       phone_verified: true,
  //     });

  //     return true;
  //   } catch (error) {
  //     // Handle any unexpected errors here
  //     throw new BadRequestException(error.message);
  //   }
  // }

  /**
   * Logs out the user by blacklisting the provided access token
   * @param {User}user -The user object representing the logged-in user.
   * @param {string}accessToken -The access token to be invalidated.
   * @returns Boolean  if the logout  was succesful.
   */

  /**
   * It decodes the refresh token, then delete the refresh token from database
   * @param {User} user - The user object that we want to logout for
   * @param {string} refreshToken - A refresh token that was sent to the client
   * @returns - A boolean value
   */
  async logout(user: User, refreshToken: string): Promise<boolean> {
    const payload = await this.tokenService.decodeRefreshToken(refreshToken);

    return await this.tokenService.deleteRefreshToken(user, payload);
  }

  /**
   * It deletes all the refresh tokens from the database
   * @param {User} user - The user object that we want to delete tokens for
   * @returns - A boolean value
   */
  async logoutFromAll(user: User): Promise<boolean> {
    return await this.tokenService.deleteRefreshTokensForUser(user);
  }

  /**
   * Validates a user during the sign-in process.
   * @param {SignInInput}input -An object containing user sign-in details, such as email and password.
   * @returns Either the user object if validation is successful or null if validation fails.
   */
  async validateUser(input: SignInInput) {
    const { email, password } = input;

    const user = await this.userService.getOne({ where: { email } });
    if (!user) {
      return null;
    }
    if (!user.phone_verified) {
      throw new BadRequestException('Email not verified');
    }
    const isValid: boolean = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    return user;
  }
}
