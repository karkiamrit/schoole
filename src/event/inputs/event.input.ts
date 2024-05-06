import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { CreateAddressInput } from '@/address/inputs/address.input';
import { CreateSubEventInput } from '@/subevent/inputs/subEvent.input';

@InputType()
export class CreateEventInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => Date)
  @IsNotEmpty()
  start_date: Date;

  @Field(() => Date)
  @IsNotEmpty()
  end_date: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  entry_fee: number;

  @Field(() => CreateAddressInput, { nullable: true })
  @IsOptional()
  address?: CreateAddressInput;
}

@InputType()
export class UpdateEventInput {
  @Field(() => String)
  @IsOptional()
  name: string;

  @Field(() => Date)
  @IsOptional()
  start_date: Date;

  @Field(() => Date)
  @IsOptional()
  end_date: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  banner?: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  entry_fee: number;

  @Field(() => CreateAddressInput, { nullable: true })
  @IsOptional()
  address?: CreateAddressInput;
}

@InputType()
export class CreateEventWithSubEventsInput extends CreateEventInput {
  @Field(() => [CreateSubEventInput], { nullable: true })
  @IsOptional()
  sub_events?: CreateSubEventInput[];
}
