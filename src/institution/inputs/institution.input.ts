import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateInstitutionInput {
  @Field(() => String)
  @IsNotEmpty()
  full_name: string;
}

@InputType()
export class UpdateInstitutionInput {
  @Field(() => String)
  @IsOptional()
  full_name: string;
}
