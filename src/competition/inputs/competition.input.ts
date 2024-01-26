import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCompetitionInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;
}

@InputType()
export class UpdateCompetitionInput {
  @Field(() => String)
  @IsOptional()
  name: string;
}
