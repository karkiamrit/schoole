import { SendMailOptions } from 'nodemailer';
import { Mail } from 'src/mail/entities/mail.entity';
import { ConfigService } from '@nestjs/config';

export interface EmailArgs {
  mail: Mail;
  to: string[] | string;
  fields?: any;
}

export interface SMSResponse {
  count: string;
  response_code: number;
  response: string;
}

export interface StringFields {
  [key: string]: string;
}

export interface MailArgsSMTP2GO {
  to: [string];
  sender: string;
  subject: string;
  text_body: string;
}

export class Mailer {
  private readonly from: string;

  constructor(
    protected readonly configService: ConfigService,
    // private readonly emailConfig = {
    //   host: this.configService.get<string>('MAIL_HOST'),
    //   port: this.configService.get<number>('MAIL_PORT'),
    //   auth: {
    //     user: this.configService.get<string>('MAIL_USER'),
    //     pass: this.configService.get<string>('MAIL_PASS'),
    //   },
    // },
  ) {
    this.from = `achivee<${this.configService.get<string>('MAIL_FROM')}>`;
  }

  async send({ to, mail }: EmailArgs): Promise<boolean> {
    const mailOptions: SendMailOptions = {
      sender: this.from,
      to: [to],
      subject: mail.subject,
      text_body: mail.text_content,
      // html: mail.html_content,
    };

    // const transporter = createTransport(this.emailConfig);

    try {
      // return (await transporter.sendMail(mailOptions)) ? true : false;
      return this.sendMailSMTPTOGO(mailOptions) ? true : false;
    } catch (err) {
      return false;
    }
  }

  private async sendMailSMTPTOGO({
    sender,
    to,
    subject,
    text_body,
  }: MailArgsSMTP2GO): Promise<boolean> {
    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Smtp2go-Api-Key': this.configService.get<string>('SMTP2GO_API_KEY'),
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: sender,
        to: to,
        subject: subject,
        text_body: text_body,
      }),
    });
    if (response.ok) {
      return true;
    }
    return false;
  }
}
