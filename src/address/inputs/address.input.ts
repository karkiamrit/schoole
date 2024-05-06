import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAddressInput {
  @Field(() => String)
  @IsOptional()
  latitude: string;

  @Field(() => String)
  @IsOptional()
  longitude: string;

  @Field(() => String)
  @IsOptional()
  address_type: string;

  @Field(() => String)
  @IsNotEmpty()
  display_name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  country?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  state?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  municipality?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  postal_code?: string;
}

@InputType()
export class UpdateAddressInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  latitude?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  longitude?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  address_type?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  display_name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  country?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  state?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  municipality?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  postal_code?: string;
}
