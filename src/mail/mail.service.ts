import { Injectable } from '@nestjs/common';
// import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { MailRepository } from './mail.repository';
import { Mail } from './entities/mail.entity';
import { CreateMailInput, UpdateMailInput } from './inputs/mail.input';
import * as _ from 'lodash';
import { Mailer, StringFields } from 'src/util/mailer';
import { ConfigService } from '@nestjs/config';
import { MailType } from '@/mail/inputs/enums/mail.enum';
@Injectable()
export class MailService extends Mailer {
  constructor(
    private readonly mailRepository: MailRepository,
    protected readonly configService: ConfigService,
  ) {
    super(configService);
  }

  create(input: CreateMailInput): Promise<Mail> {
    return this.mailRepository.save(input);
  }

  async update(id: number, input: UpdateMailInput): Promise<Mail> {
    const mail = await Mail.findOne({ where: { id } });
    const update = _.merge(mail, _.pickBy(input, _.identity));
    return this.mailRepository.save({ ...update });
  }

  async sendResetPasswordLink(email: string, link: string): Promise<boolean> {
    let mail = await Mail.findOne({
      where: { mail_type: MailType.RESET_PASSWORD },
    });
    if (!mail) return false;
    mail = _.merge(mail, {
      html_content: this.resolveTemplateFields(mail.html_content, { link }),
      text_content: this.resolveTemplateFields(mail.text_content, { link }),
    });

    return await this.send({ to: email, mail });
  }

  async delete(id: number) {
    const mail = await Mail.findOne({ where: { id } });
    if (!mail) {
      throw new Error('Mail not found');
    }
    await this.mailRepository.delete({ id });
    return mail;
  }

  resolveTemplateFields(content: string, fields: StringFields) {
    let text = _.clone(content);
    const variables: string[] = Object.keys(fields);
    for (let i = 0; i < variables.length; i++) {
      const key: string = variables[i];
      const value: string = fields[key];
      text = text?.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return text;
  }

  async sendOtpEmail(email: string, otp: string): Promise<boolean> {
    let mail = await Mail.findOne({
      where: { mail_type: MailType.VERIFY_EMAIL_OTP }
    });

    if (mail == null) return false;
    mail = _.merge(mail, {
      html_content: this.resolveTemplateFields(mail.html_content, { otp }),
      text_content: this.resolveTemplateFields(mail.text_content, { otp }),
    });

    return await this.send({ to: email, mail });
  }

  async sendVerifyEmailLink(email: string, link: string): Promise<boolean> {
    let mail = await Mail.findOne({
      where: { mail_type: MailType.VERIFY_EMAIL_LINK },
    }); // Adjust this to fetch the correct mail template
    console.log(mail, 'mail');
    if (mail == null) return false;
    mail = _.merge(mail, {
      html_content: this.resolveTemplateFields(mail.html_content, { link }),
      text_content: this.resolveTemplateFields(mail.text_content, { link }),
    });

    return await this.send({ to: email, mail });
  }
}
