import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAddressInput {
  @Field(() => String)
  @IsNotEmpty()
  state: string;

  @Field(() => String)
  @IsNotEmpty()
  district: string;

  @Field(() => String)
  @IsNotEmpty()
  city: string;

  @Field(() => Number)
  @IsNotEmpty()
  ward: number;
}

@InputType()
export class UpdateAddressInput {
  @Field(() => String)
  @IsOptional()
  state: string;

  @Field(() => String)
  @IsOptional()
  district: string;

  @Field(() => String)
  @IsOptional()
  city: string;

  @Field(() => Number)
  @IsOptional()
  ward: number;
}
