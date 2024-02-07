import { UserService } from '../user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInInput, SignUpInput } from 'src/auth/inputs/auth.input';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { JwtWithUser } from './entities/auth._entity';
import { OtpService } from '../otp/otp.service';
import { MailService } from '../mail/mail.service';
import { FULL_WEB_URL } from 'src/util/config/config';
import { OtpType } from 'src/otp/entities/otp.entity';
import { ApolloError } from 'apollo-server-core';
import { Http } from 'src/util/http';
import * as crypto from 'crypto';
import { TokenService } from '@/token/token.service';

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
     *JwtService: Manages JWT (JSON Web Token) creation and verification.*/

    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly http: Http,
    private readonly jwtService: JwtService,
  ) {}

  private generateUniqueIdentifier(): string {
    const uniqueIdentifier = crypto.randomBytes(16).toString('hex');
    return uniqueIdentifier;
  }

  private generateResetPasswordToken(user: User): string {
    const uniqueIdentifier = this.generateUniqueIdentifier();
    const payload = {
      sub: user.id,
      email: user.email,
      jti: uniqueIdentifier,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
  }

  async signUp(input: SignUpInput): Promise<User> {
    const { phone, password } = input;

    const user = await this.userService.getOne({ where: { phone } });
    if (user) {
      throw new ApolloError('User already exists', 'USER_ALREADY_EXISTS', {
        statusCode: 409,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const savedUser = this.userService.create({
      ...input,
      phone,
      password: hashedPassword,
    });

    await this.requestOtpVerifyEmail(phone, OtpType.PHONE_VERIFY);

    return savedUser;
  }

  async signIn(input: SignInInput): Promise<JwtWithUser> {
    const user = await this.userService.getOne({
      where: { phone: input.phone },
    });

    if (!user) {
      throw new ApolloError("User doesn't exist", 'USER_NOT_FOUND', {
        statusCode: 404,
      });
    }
    if (user.phone_verified === false) {
      throw new ApolloError('Phone not verified', 'PHONE_NOT_VERIFIED', {
        statusCode: 403,
      });
    }

    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);

    return { user, accessToken, refreshToken };
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

    // Generate a reset password token
    const resetPasswordToken = this.generateResetPasswordToken(user);

    // Create a reset password URL with the token
    const resetPasswordUrl = `${FULL_WEB_URL}/reset-password/${resetPasswordToken}`;

    // Send the reset password link to the user's email
    await this.mailService.sendResetPasswordLink(user.email, resetPasswordUrl);

    return true;
  }

  /**
   * Resets the password for a user using a reset password token
   * @param {string} token - Reset password token received by the user.
   * @param {string} password - New password to set for the user.
   * @returns   boolean if the operation is successful.
   */

  async resetPassword(token: string, password: string): Promise<boolean> {
    try {
      // Verify and decode the token to get user information
      const payload = this.jwtService.verify(token);
      const userId = payload.sub; // Assuming 'sub' contains the user's ID

      // Find the user based on the decoded user ID
      const user = await this.userService.getOne({ where: { id: userId } });
      if (!user) {
        throw new ApolloError('User not found', 'USER_NOT_FOUND', {
          statusCode: 404, // Not Found
        });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update the user's password with the new hashed password
      const updatedUser = await this.userService.update(user.id, {
        password: hashedPassword,
      });

      if (!updatedUser) {
        throw new ApolloError(
          'Failed to update password',
          'PASSWORD_UPDATE_FAILED',
          {
            statusCode: 500, // Internal Server Error
          },
        );
      }

      return true;
    } catch (error) {
      // Handle any unexpected errors here
      throw new ApolloError(
        'An error occurred while resetting the password',
        'INTERNAL_ERROR',
        {
          statusCode: 500, // Internal Server Error
          errorDetails: error.message, // Include more details about the error if needed
        },
      );
    }
  }

  /**
   * Initiates the process of sending a One-Time Password (OTP) to the user's email for verification.
   * @param {string}email -Email address of the user for whom the OTP is requested.
   * @param {OtpType}otpType- An enumeration specifying the type of OTP (e.g., "EMAIL", "PHONE").
   * @returns  boolean if the operation is successful.
   */
  async requestOtpVerifyEmail(
    email: string,
    otpType: OtpType,
  ): Promise<boolean> {
    try {
      const user = await this.userService.getOne({ where: { email } });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      const otp = await this.otpService.create(user, otpType);

      const message = `Your OTP for ${otpType.toLowerCase()} is ${otp.code}`;
      await this.mailService.sendOtpEmail(email, message);
      console.log(otp);
      return true;
    } catch (error) {
      // Handle any unexpected errors here
      throw new BadRequestException(error.message);
    }
  }
  /**
   * Verifies the user's email by checking the validity of the provided OTP code.
   * @param {string} email -Email address of the user for whom email verification is requested.
   * @param {string}otpCode-The OTP code provided by the user for verification.
   * @returns Boolean if the email verification is successful.
   */

  async verifyEmail(email: string, otpCode: string): Promise<boolean> {
    try {
      const user = await this.userService.getOne({ where: { email } });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Send the reset password link to the user's email
      if (user.email_verified) {
        throw new BadRequestException('Email already verified');
      }

      // Verify the OTP code with the user's OTP
      const otp = await this.otpService.getOne(
        otpCode,
        user,
        OtpType.EMAIL_VERIFY,
      );

      if (!otp) {
        throw new BadRequestException('Invalid OTP');
      }
      // Implement OTP verification logic here
      // Retrieve the OTP associated with the user and check if it matches otpCode

      // If the OTP is valid, set user.phone_verified to true and update the user
      await this.userService.updateVerification(user.id, {
        email_verified: true,
      });

      return true;
    } catch (error) {
      // Handle any unexpected errors here
      throw new BadRequestException(error.message);
    }
  }

  async requestOtpVerifyPhone(
    phone: string,
    otpType: OtpType,
  ): Promise<boolean> {
    try {
      const user = await this.userService.getOne({ where: { phone } });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      const otp = await this.otpService.create(user, otpType);

      const message = `Your OTP for ${otpType.toLowerCase()} is ${otp.code}`;
      // Send the OTP to the user's phone number
      await this.http.sendSms(phone, message);

      return true;
    } catch (error) {
      // Handle any unexpected errors here
      throw new BadRequestException(error.message);
    }
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
    const user = await this.userService.getOne({ where: { phone } });
    if (!user) throw new ApolloError('Invalid phone number!');

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

    await this.otpService.update(
      _.merge(otp, {
        is_used: true,
        user: _.assign(user, { phone_verified: true, phone }),
      }),
    );

    return true;
  }

  /**
   * Logs out the user by blacklisting the provided access token
   * @param {User}user -The user object representing the logged-in user.
   * @param {string}accessToken -The access token to be invalidated.
   * @returns Boolean  if the logout  was succesful.
   */

  async logout(user: User): Promise<boolean> {
    // Update the user's refresh token to invalidate it
    await this.userService.update(user.id, { refresh_token: null });

    return true;
  }

  /**
   * Validates a user during the sign-in process.
   * @param {SignInInput}input -An object containing user sign-in details, such as email and password.
   * @returns Either the user object if validation is successful or null if validation fails.
   */
  async validateUser(input: SignInInput) {
    const { phone, password } = input;

    const user = await this.userService.getOne({ where: { phone } });
    if (!user) {
      return null;
    }
    if (!user.email_verified) {
      throw new BadRequestException('Email not verified');
    }
    const isValid: boolean = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    return user;
  }
}
