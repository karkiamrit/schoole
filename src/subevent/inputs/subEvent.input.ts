import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { CreateAddressInput } from '@/address/inputs/address.input';
import { SubEventType } from '@/subevent/inputs/enums';

@InputType()
export class CreateSubEventInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  description: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  registration_fee: number;

  @Field(() => SubEventType, { nullable: false })
  @IsNotEmpty()
  type: SubEventType;

  @Field(() => [String], { nullable: false })
  @IsOptional()
  category?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  rules: string;

  @Field(() => Date)
  @IsNotEmpty()
  start_date: Date;

  @Field(() => Date)
  @IsNotEmpty()
  end_date: Date;

  @Field(() => CreateAddressInput, { nullable: true })
  @IsOptional()
  address: CreateAddressInput;
}

@InputType()
export class UpdateSubEventInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  banner?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  displayPicture?: string;

  @Field(() => CreateAddressInput, { nullable: true })
  @IsOptional()
  address?: CreateAddressInput;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  registration_fee: number;

  @Field(() => SubEventType, { nullable: false })
  @IsNotEmpty()
  type: SubEventType;

  @Field(() => [String], { nullable: false })
  @IsOptional()
  category?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  rules?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  start_date?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  end_date?: Date;
}
