import { Injectable } from '@nestjs/common';
import { CreateContactInput } from '@/contact/inputs/contact.input';
import { Contact } from '@/contact/contact.entity';
import { ContactType } from '@/contact/inputs/contact.enum';
import { ContactRepository } from '@/contact/contact.repository';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { ApolloError } from 'apollo-server-core';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly configService: ConfigService,
  ) {}

  async createBusinessQueryContactService(
    input: CreateContactInput,
  ): Promise<Contact> {
    const recaptchaToken = input.reCaptchaToken;

    const isCaptchaValid = await this.validateCaptcha(recaptchaToken);
    if (!isCaptchaValid) {
      throw new ApolloError(
        'Captcha Validation Failed',
        'CAPTCH_VALIDATION_FAILED',
        {
          statusCode: 403,
        },
      );
    }

    const contact = this.contactRepository.create({
      fullName: input.fullName,
      email: input.email,
      message: input.message,
      mobileNumber: input.mobileNumber,
      organizationName: input.organizationName,
      source: input.source,
      otherSource: input.otherSource,
      contactType: ContactType.BUSINESS_QUERY,
    });
    return await this.contactRepository.save(contact);
  }

  async validateCaptcha(recaptchaToken: string): Promise<boolean> {
    const secretKey = this.configService.get('RECAPTCHA_SECRET_KEY');
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`,
    );

    const { success } = response.data;
    return !!success;
  }
}
