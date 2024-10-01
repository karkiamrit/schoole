import { Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { Otp, OtpType } from './entities/otp.entity';
import { User } from 'src/user/entities/user.entity';
import { MoreThan } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@Injectable()
export class OtpService {
  constructor(private readonly otpRepository: OtpRepository) {}

  /**
   * Create and save an OTP object to the database.
   * @param {User} user - The user for whom the OTP is created.
   * @param {OtpType} otpType - The type of the OTP (e.g., EMAIL_VERIFICATION).
   * @returns The created OTP object.
   */
  async create(user: User, otpType: OtpType): Promise<Otp> {
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresIn = new Date(Date.now() + 15 * 60_000);

    // Create the OTP object without using the repository
    const otp = new Otp();
    otp.code = otpCode;
    otp.operation = otpType;
    otp.user = user;
    otp.phone_number = user.phone;
    otp.email = user.email;
    otp.expires_in = expiresIn;
    return this.otpRepository.save(otp);
  }

  async createReverifyOtp(
    user: User,
    otpType: OtpType,
    email?: string,
    phone?: string,
  ): Promise<Otp> {
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresIn = new Date(Date.now() + 15 * 60_000);
    const otp = new Otp();
    otp.code = otpCode;
    otp.expires_in = expiresIn;
    otp.user = user;
    otp.phone_number = phone;
    otp.email = email;
    otp.operation = otpType;
    return this.otpRepository.save(otp);
  }

  async create_password_reset_otp(phone: string): Promise<Otp> {
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresIn = new Date(Date.now() + 15 * 60_000);

    await this.invalidPreviosIssuedPasswordResetOtp(phone);
    // Create the OTP object without using the repository
    const otp = new Otp();
    otp.code = otpCode;
    otp.operation = OtpType.PASSWORD_RESET;
    otp.phone_number = phone;
    otp.expires_in = expiresIn;
    return this.otpRepository.save(otp);
  }

  /**
   * Retrieve the OTP based on the parameter values.
   * @param {string} otpCode - The OTP code which is to be retrieved.
   * @param {User} user - The user whose OTP is to be retrieved.
   * @param {OtpType} operation - Type of the OTP.
   * @returns  The OTP object.
   */
  getOne(otpCode: string, user: User, operation: OtpType): Promise<Otp | null> {
    return this.otpRepository.findOne({
      where: { code: otpCode, user: { id: user.id }, operation },
    });
  }

  findOne(qs: FindOneOptions<Otp>): Promise<Otp | null> {
    return this.otpRepository.findOne(qs);
  }

  /**
   * Udpate and save an OTP object to the database.
   * @param {Otp} otp - The  OTP which should be updated.
   * @returns  The boolean value if the update is successfull.
   */ data;
  async update(otp: Otp): Promise<boolean> {
    await this.otpRepository.save(otp);
    return true;
  }

  async CheckValidOtp(phone: string, otpCode: string): Promise<Otp | null> {
    const otp = await this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.phone_number = :phoneNumber', { phoneNumber: phone })
      .andWhere('otp.code = :otpCode', { otpCode: otpCode })
      .andWhere('otp.is_used = :isUsed', { isUsed: false })
      .andWhere('otp.expires_in  > :currentTime', { currentTime: new Date() })
      .getOne();

    if (otp) {
      otp.is_used = true;
      await this.otpRepository.save(otp);
      return otp;
    }
  }

  async checkValidOtpForEmailVerify(
    email: string,
    otpCode: string,
    user: User,
  ): Promise<Otp | null> {
    const otp = await this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.email = :email', { email: email })
      .andWhere('otp.code = :otpCode', { otpCode: otpCode })
      .andWhere('otp.is_used = :isUsed', { isUsed: false })
      .andWhere('otp.expires_in  > :currentTime', { currentTime: new Date() })
      .andWhere('otp.user_id = :userId', { userId: user.id })
      .getOne();

    if (otp) {
      otp.is_used = true;
      await this.otpRepository.save(otp);
      return otp;
    }
  }

  async invalidPreviosIssuedPasswordResetOtp(phone: string): Promise<boolean> {
    try {
      await this.otpRepository
        .createQueryBuilder('otp')
        .update()
        .set({ expires_in: new Date() })
        .where({
          phone_number: phone,
          expires_in: MoreThan(new Date()),
          is_used: false,
        })
        .execute();
      return true;
    } catch (e) {
      return false;
    }
  }
}
