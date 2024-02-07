import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { UserType } from '@/user/inputs/enums/usertype.enum';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(10, { message: 'Phone number should be atleast 10 digits long' })
  @MaxLength(10, { message: 'Phone number cannot be more than 10 digits long' })
  phone: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(10, { message: 'Password should be atleast 10 digits long' })
  password: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(255, {
    message: 'Username number should be atmost 255 characters long',
  })
  username?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(() => String)
  @IsOptional()
  profile_picture?: string;

  @Field(() => String)
  @IsNotEmpty()
  user_type: UserType;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  phone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  password?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  username?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  profile_picture?: string;

  @Field(() => String, { nullable: true })
  refresh_token?: string;
}

@InputType()
export class UpdateUserInputAdmin extends UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  role?: 'Admin' | 'user';
}

@InputType()
export class UpdateVerificationInput {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  email_verified?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  phone_verified?: boolean;
}

@InputType()
export class UserIdInput {
  @Field(() => String)
  @IsNotEmpty()
  id: string;
}
