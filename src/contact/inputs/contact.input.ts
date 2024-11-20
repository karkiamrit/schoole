import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateContactInput {
  @Field(() => String)
  @IsNotEmpty()
  fullName: string;

  @Field(() => String)
  @IsNotEmpty()
  mobileNumber: string;

  @Field(() => String)
  @IsNotEmpty()
  organizationName: string;

  @Field(() => String)
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  message: string;

  @Field(() => String)
  @IsNotEmpty()
  reCaptchaToken: string;

  @Field(() => [String])
  @IsNotEmpty()
  source: string[];
}
