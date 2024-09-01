import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ForgotPasswordMethod } from '@/auth/auth.enums';

@InputType()
export class SignUpInput {
  @Field()
  @IsNotEmpty()
  @MinLength(10, { message: 'Phone number should be atleast 10 digits long' })
  @MaxLength(10, { message: 'Phone number should be atmost 10 digits long' })
  phone: string;

  @Field()
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(10, { message: 'Password should be atleast 10 digits long' })
  @MaxLength(255, { message: 'Password should be atmost 255 digits long' })
  password: string;
}

@InputType()
export class SignInInput extends SignUpInput {}

@InputType()
export class SignUpWithEmailInput {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  email: string;

  @Field()
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(10, { message: 'Password should be at least 10 digits long' })
  @MaxLength(255, { message: 'Password should be at most 255 digits long' })
  password: string;
}

@InputType()
export class SignInWithEmailInput extends SignUpWithEmailInput {}

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsNotEmpty()
  method: ForgotPasswordMethod;

  @Field()
  @IsNotEmpty()
  input: string;
}
