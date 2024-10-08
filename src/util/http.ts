import axios from 'axios';

import { SPARROW_SMS_ENDPOINT, SPARROW_TOKEN, SMS_FROM } from './config/config';
import { SMSResponse } from './mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Http {
  async sendSms(phone: string, message: string): Promise<SMSResponse> {
    try {
      const response = await axios.post(SPARROW_SMS_ENDPOINT, {
        token: SPARROW_TOKEN,
        from: SMS_FROM,
        to: phone,
        text: message,
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}
