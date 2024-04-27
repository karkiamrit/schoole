import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { CreateAddressInput } from '@/address/inputs/address.input';

@InputType()
export class CreateSubEventInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  description: string;

  @Field(() => String)
  @IsNotEmpty()
  category: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  rules: string[];

  @Field(() => Date)
  @IsNotEmpty()
  start_date: Date;

  @Field(() => Date)
  @IsNotEmpty()
  end_date: Date;

  @Field(() => CreateAddressInput, { nullable: true })
  @IsOptional()
  address?: CreateAddressInput;
}

@InputType()
export class UpdateSubEventInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => CreateAddressInput, { nullable: true })
  @IsOptional()
  address?: CreateAddressInput;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  category?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  rules?: string[];

  @Field(() => Date, { nullable: true })
  @IsOptional()
  start_date?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  end_date?: Date;
}
