import { registerEnumType } from '@nestjs/graphql';

export enum ForgotPasswordMethod {
  phone = 'phone',
  email = 'email',
}

registerEnumType(ForgotPasswordMethod, {
  name: 'ForgotPasswordMethod',
  description: 'Enum for method of resetting password',
});
