import { Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { Otp, OtpType } from './entities/otp.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OtpService {
  constructor(private readonly otpRepository: OtpRepository) { }

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
    otp.expires_in = expiresIn;
    return this.otpRepository.create(otp);
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
  /**
     * Udpate and save an OTP object to the database.
     * @param {Otp} otp - The  OTP which should be updated.
     * @returns  The boolean value if the update is successfull.
     */
  async update(otp: Otp): Promise<boolean> {
    await this.otpRepository.save(otp);
    return true;
  }
}
