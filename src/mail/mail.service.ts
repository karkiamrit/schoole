import { Injectable } from '@nestjs/common';
// import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { MailRepository } from './mail.repository';
import { Mail } from './entities/mail.entity';
import { CreateMailInput, UpdateMailInput } from './inputs/mail.input';
import * as _ from 'lodash';
import { Mailer, StringFields } from 'src/util/mailer';
@Injectable()
export class MailService extends Mailer {
  constructor(private readonly mailRepository: MailRepository) {
    super();
  }
   /**
   * Creates a new mail record.
   * @param input - Mail details.
   * @returns The created mail record.
   */

  create(input: CreateMailInput): Promise<Mail> {
    return this.mailRepository.save(input);
  }
  /**
   * Updates an existing mail record by its ID.
   * @param id - ID of the mail record to be updated.
   * @param input - Updated mail details.
   * @returns The updated mail record.
   */
  async update(id: number, input: UpdateMailInput): Promise<Mail> {
    const mail = await Mail.findOne({ where: { id } });
    const update = _.merge(mail, _.pickBy(input, _.identity));
    return this.mailRepository.save({ ...update });
  }

    /**
   * Sends a reset password link email.
   * @param email - Email address of the recipient.
   * @param link - Reset password link.
   * @returns True if the email is sent successfully, false otherwise.
   */
  async sendResetPasswordLink(email: string, link: string): Promise<boolean> {
    let mail = await Mail.findOne({ where: { id: 1 } });
    if (!mail) return false;
    mail = _.merge(mail, {
      html_content: this.resolveTemplateFields(mail.html_content, { link }),
      text_content: this.resolveTemplateFields(mail.text_content, { link }),
    });

    return await this.send({ to: email, mail });
  }
  /**
   * Deletes a mail record by its ID.
   * @param id - ID of the mail record to be deleted.
   * @returns The deleted mail record.
   * @throws Error if the mail record is not found.
   */
  async delete(id: number) {
    const mail = await Mail.findOne({ where: { id } });
    if (!mail) {
      throw new Error('Mail not found');
    }
    await this.mailRepository.delete({ id });
    return mail;
  }
    /**
   * Resolves template fields in the mail content.
   * @param content - Mail content with placeholders.
   * @param fields - Key-value pairs to replace placeholders.
   * @returns Resolved mail content.
   */ 

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
 /**
   * Sends an OTP (One-Time Password) email.
   * @param email - Email address of the recipient.
   * @param otp - One-Time Password.
   * @returns True if the email is sent successfully, false otherwise.
   */
  async sendOtpEmail(email: string, otp: string): Promise<boolean> {
    let mail = await Mail.findOne({ where: { id: 1 } }); // Adjust this to fetch the correct mail template

    if (mail == null) return false;
    mail = _.merge(mail, {
      html_content: this.resolveTemplateFields(mail.html_content, { otp }),
      text_content: this.resolveTemplateFields(mail.text_content, { otp }),
    });

    return await this.send({ to: email, mail });
  }
}
