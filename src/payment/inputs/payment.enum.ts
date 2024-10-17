import { registerEnumType } from '@nestjs/graphql';
export enum PaymentMethods {
  ESEWA = 'ESEWA',
  KHALTI = 'KHALTI',
}
registerEnumType(PaymentMethods, {
  name: 'PaymentMethods', // this one is mandatory
  description: 'Different type of payment channels. ', // this one is optional
});
