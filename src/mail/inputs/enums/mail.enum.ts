import { registerEnumType } from '@nestjs/graphql';
export enum MailType {
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_EMAIL_OTP = 'VERIFY_EMAIL_OTP',
  VERIFY_EMAIL_LINK = 'VERIFY_EMAIL_LINK',
}
registerEnumType(MailType, {
  name: 'MailType', // this one is mandatory
  description: 'The basic roles of users', // this one is optional
});
