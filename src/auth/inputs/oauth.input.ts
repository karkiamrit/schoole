import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class OAuthSignInInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  provider: string; // e.g., 'google', 'facebook'

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  providerId: string; // The unique ID from the provider

  @Field(() => String, { nullable: true })
  @IsOptional()
  profile_picture?: string;

  @Field(() => String)
  @IsOptional()
  email?: string;
}
