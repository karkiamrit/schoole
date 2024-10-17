import { UserService } from '@/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  SignInInput,
  SignInWithEmailInput,
  SignUpInput,
  SignUpWithEmailInput,
} from 'src/auth/inputs/auth.input';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/user/entities/user.entity';
import { JwtWithUser } from './entities/auth._entity';
import { OtpService } from '@/otp/otp.service';
import { MailService } from '@/mail/mail.service';
import { FULL_WEB_URL } from 'src/util/config/config';
import { Otp, OtpType } from 'src/otp/entities/otp.entity';
import { ApolloError } from 'apollo-server-core';
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
      secret: 'secrectkeyneedtochangelater',
      privateKey: 'Privatekeyneedtochangelater',
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

    const savedUser = await this.userService.create({
      ...input,
      phone,
      password: hashedPassword,
    });

    await this.requestOtpVerifyPhone(phone, OtpType.PHONE_VERIFY);

    return savedUser;
  }

  async signUpWithEmail(input: SignUpWithEmailInput): Promise<User> {
    const { email, password } = input;

    const user = await this.userService.getOne({ where: { email } });
    if (user) {
      throw new ApolloError('User already exists', 'USER_ALREADY_EXISTS', {
        statusCode: 409,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const savedUser = await this.userService.create({
      ...input,
      email,
      password: hashedPassword,
    });

    await this.requestOtpVerifyEmail(email, OtpType.EMAIL_VERIFY);
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

  async SignInWithEmail(input: SignInWithEmailInput): Promise<JwtWithUser> {
    const user = await this.userService.getOne({
      where: { email: input.email },
    });

    if (!user) {
      throw new ApolloError("User doesn't exist", 'USER_NOT_FOUND', {
        statusCode: 404,
      });
    }
    if (user.email_verified === false) {
      throw new ApolloError('Email not verified', 'EMAIL_NOT_VERIFIED', {
        statusCode: 403,
      });
    }

    const hasValidPassword = await bcrypt.compare(
      input.password,
      user.password,
    );
    if (!hasValidPassword) {
      throw new ApolloError('Invalid Password', 'INVALID_PASSWORD', {
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
  async forgotPasswordWithEmail(email: string): Promise<boolean> {
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

  async forgotPasswordWithPhone(phone: string): Promise<boolean> {
    const user = await this.userService.getOne({ where: { phone } });
    if (!user) {
      throw new ApolloError("Phone doesn't exist!", 'PHONE_NOT_FOUND', {
        statusCode: 404, // Not Found
      });
    }

    // Generate a reset password token

    await this.otpService.create_password_reset_otp(phone);

    // ideally this otp is supposed to be sent through sms. currently the otp is static we will change it later

    // // Create a reset password URL with the token
    // const resetPasswordUrl = `${FULL_WEB_URL}/reset-password/${resetPasswordToken}`;
    //
    // // Send the reset password link to the user's email
    // await this.mailService.sendResetPasswordLink(user.email, resetPasswordUrl);
    return true;
  }

  async validateResetPasswordOtp(
    phone: string,
    otp: string,
  ): Promise<string | null> {
    // first check the otp is available with correspoing phone number & check it expirity
    const otp_instance = await this.otpService.CheckValidOtp(phone, otp);
    if (otp_instance) {
      const user = await this.userService.getOne({ where: { phone } });
      return this.generateResetPasswordToken(user);
    } else {
      return null;
    }
  }

  /**
   * Resets the password for a user using a reset password token
   * @returns   boolean if the operation is successful.
   */
  async resetPassword(token: string, password: string): Promise<boolean> {
    try {
      // Verify and decode the token to get user information
      const payload = this.jwtService.verify(token, {
        secret: 'secrectkeyneedtochangelater',
      });
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

  async updatePassword(
    oldPassword: string,
    newPassword: string,
    user: User,
  ): Promise<boolean> {
    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      throw new ApolloError(
        'Please Choose another password ',
        'SAME_PASSWORD',
        {
          statusCode: 400,
        },
      );
    }

    const hasOldPasswordMatched = await bcrypt.compare(
      oldPassword,
      user.password,
    );
    if (hasOldPasswordMatched) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.userService.update(user.id, {
        password: hashedPassword,
      });
      return true;
    }

    throw new ApolloError('Invalid Old Password', 'INVALID_OLD_PASSWORD', {
      statusCode: 400,
    });
  }
  /**
   * Initiates the process of sending a One-Time Password (OTP) to the user's email for verification.
   * @param {string}email -Email address of the user for whom the OTP is requested.
   * @param otpType
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const otp = await this.otpService.create(user, otpType);

      // TODO: need to fix this later
      // const message = `Your OTP for ${otpType.toLowerCase()} is ${otp.code}`;
      // await this.mailService.sendOtpEmail(email, message);
      return true;
    } catch (error) {
      // Handle any unexpected errors here
      throw new ApolloError(
        'An error occurred while Processing Otp Verify Email',
        'INTERNAL_ERROR',
        {
          statusCode: 500, // Internal Server Error
          errorDetails: error.message, // Include more details about the error if needed
        },
      );
    }
  }

  /**
   * Verifies the user's email by checking the validity of the provided OTP code.
   * @param {string} email -Email address of the user for whom email verification is requested.
   * @param {string} otpCode- The OTP code provided by the user for verification.
   * @returns Boolean if the email verification is successful.
   */

  // used in client side
  async verifyEmail(
    email: string,
    otpCode: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.userService.getOne({ where: { email } });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Send the reset passrequestOtpVerifyEmailword link to the user's email
      if (user.email_verified) {
        throw new BadRequestException('Email already verified');
      }

      const accessToken = this.tokenService.generateAccessToken(user);
      const refreshToken = this.tokenService.generateRefreshToken(user);

      // TODO: NEED TO REMOVE LATER
      if (otpCode == '123456') {
        await this.userService.updateVerification(user.id, {
          email_verified: true,
        });
        return { accessToken, refreshToken };
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

      await this.otpService.update(
        _.merge(otp, {
          is_used: true,
          user: _.assign(user, { email_verified: true, email }),
        }),
      );
      return { accessToken, refreshToken };
    } catch (error) {
      // Handle any unexpected errors here
      throw new BadRequestException(error.message);
    }
  }

  // used in client
  async requestReverifyEmailOtp(
    user: User,
    email: string,
    otpType: OtpType,
  ): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const otp = await this.otpService.createReverifyOtp(
        user,
        otpType,
        email,
        null,
      );

      // TODO: need to fix this later
      // const message = `Your OTP for ${otpType.toLowerCase()} is ${otp.code}`;
      // await this.mailService.sendOtpEmail(email, message);
      return true;
    } catch (error) {
      // Handle any unexpected errors here
      throw new ApolloError(
        'An error occurred while Processing Otp Verify Email',
        'INTERNAL_ERROR',
        {
          statusCode: 500, // Internal Server Error
          errorDetails: error.message, // Include more details about the error if needed
        },
      );
    }
  }

  // used in client
  async reverifyEmail(
    user: User,
    email: string,
    otpCode: string,
  ): Promise<Otp> {
    try {
      const otp = await this.otpService.checkValidOtpForEmailVerify(
        email,
        otpCode,
        user,
      );
      if (!otp) {
        throw new BadRequestException('Invalid OTP');
      }
      otp.is_used = true;
      await this.otpService.update(otp);
      return otp;
    } catch (error) {
      throw new ApolloError(error.message);
    }
  }

  async requestOtpVerifyPhone(
    phone: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    otpType: OtpType,
  ): Promise<boolean> {
    try {
      const user = await this.userService.getOne({ where: { phone } });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const otp = await this.otpService.create(user, otpType);

      // const message = `Your OTP for ${otpType.toLowerCase()} is ${otp.code}`;
      // Send the OTP to the user's phone number
      // await this.http.sendSms(user.phone, message);
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
  async verifyPhone(
    phone: string,
    otpCode: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    let user = await this.userService.getOne({ where: { phone } });
    if (!user) throw new ApolloError('Invalid phone number!');

    if (otpCode === '123456') {
      user = await this.userService.updateVerification(user.id, {
        phone_verified: true,
      });
    } else {
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
    }

    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);

    return { user, accessToken, refreshToken };
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
    if (user.phone_verified === false) {
      throw new BadRequestException('Phone not verified');
    }
    const isValid: boolean = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return user;
  }
}
