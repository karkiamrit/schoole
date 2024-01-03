import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateVolunteerInput {
  @Field(() => String)
  @IsNotEmpty()
  full_name: string;
}

@InputType()
export class UpdateVolunteerInput {
  @Field(() => String)
  @IsOptional()
  full_name: string;
}
