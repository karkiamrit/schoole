import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAddressInput {
  @Field(() => String)
  @IsNotEmpty()
  latitude: string;
}

@InputType()
export class UpdateAddressInput {
  @Field(() => String)
  @IsOptional()
  latitude: string;
}
