import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  @IsNotEmpty()
  payment_method: string;
}

@InputType()
export class UpdatePaymentInput {
  @Field(() => String)
  @IsOptional()
  payment_method: string;
}

@InputType()
export class ESewaPaymentInput {
  @Field(() => String)
  @IsNotEmpty()
  amount: string;

  @Field(() => String)
  @IsNotEmpty()
  tax_amount: string;

  @Field(() => String)
  @IsNotEmpty()
  total_amount: string;

  @Field(() => String)
  @IsNotEmpty()
  transaction_uuid: string;

  @Field(() => String)
  @IsNotEmpty()
  product_service_charge: string;

  @Field(() => String)
  @IsNotEmpty()
  product_delivery_charge: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  product_code?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  success_url?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  failure_url?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  signed_field_names?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  signature?: string;
}

@InputType()
export class KhaltiPaymentInput {
  @Field(() => Number)
  @IsNotEmpty()
  amount: number;

  @Field(() => Number)
  @IsNotEmpty()
  sub_event_id: number;

  @Field(() => String)
  @IsNotEmpty()
  product_name: string;
}
