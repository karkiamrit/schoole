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
    this.from = `Achivee<${this.configService.get<string>('MAIL_FROM')}>`;
  }

  async send({ to, mail }: EmailArgs): Promise<boolean> {
    const mailOptions: SendMailOptions = {
      sender: this.from,
      to: [to],
      subject: mail.subject,
      text_body: mail.text_content,
    };

    // const transporter = createTransport(this.emailConfig);

    try {
      // return (await transporter.sendMail(mailOptions)) ? true : false;
      const body = JSON.stringify(mailOptions);
      return !!(await this.sendMailSMTPTOGO(body));
    } catch (err) {
      return false;
    }
  }

  async sendHtml({ to, mail }: EmailArgs): Promise<boolean> {
    const mailOptions: SendMailOptions = {
      sender: this.from,
      to: [to],
      subject: mail.subject,
      html_body: mail.html_content,
    };
    try {
      // return (await transporter.sendMail(mailOptions)) ? true : false;
      const body = JSON.stringify(mailOptions);
      return !!(await this.sendMailSMTPTOGO(body));
    } catch (err) {
      return false;
    }
  }

  private async sendMailSMTPTOGO(body: string): Promise<boolean> {
    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Smtp2go-Api-Key': this.configService.get<string>('SMTP2GO_API_KEY'),
        accept: 'application/json',
      },
      body: body,
    });
    if (response.ok) {
      console.log(response.ok, 'after sending email to');
      return true;
    }
    return false;
  }
}
