import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCompetitionInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  description: string;

  @Field(() => String)
  @IsNotEmpty()
  category: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  rules: string[];

  @Field(() => Date)
  @IsNotEmpty()
  start_date: Date;

  @Field(() => Date)
  @IsNotEmpty()
  end_date: Date;
}

@InputType()
export class UpdateCompetitionInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  category?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  rules?: string[];

  @Field(() => Date, { nullable: true })
  @IsOptional()
  start_date?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  end_date?: Date;
}
