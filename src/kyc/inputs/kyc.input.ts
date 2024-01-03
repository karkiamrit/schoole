import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateKycInput {
  @Field(() => String)
  @IsNotEmpty()
  established_on: string;
}

@InputType()
export class UpdateKycInput {
  @Field(() => String)
  @IsOptional()
  established_on: string;
}
