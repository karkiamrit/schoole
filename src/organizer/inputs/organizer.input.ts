import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrganizerInput {
  @Field(() => String)
  @IsNotEmpty()
  full_name: string;
}

@InputType()
export class UpdateOrganizerInput {
  @Field(() => String)
  @IsOptional()
  full_name: string;
}
