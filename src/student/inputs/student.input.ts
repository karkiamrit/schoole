import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Gender, Level } from './enums/index';
import { isEmpty } from 'lodash';

@InputType()
export class CreateStudentInput {
  //we dont need to explicitly define the user or other association field as input

  @Field(() => String)
  @IsNotEmpty()
  first_name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  middle_name?: string;

  @Field(() => String)
  @IsNotEmpty()
  last_name: string;

  @Field(() => Date)
  @IsOptional()
  date_of_birth?: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  bio?: string;

  @Field(() => Gender)
  @IsNotEmpty()
  gender: Gender;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  interests?: string[];

  @Field(() => Level)
  @IsNotEmpty()
  level: Level;
}

@InputType()
export class UpdateStudentInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  first_name?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  interests?: string[];

  @Field(() => Level, { nullable: true })
  @IsOptional()
  level?: Level;

  @Field(() => String, { nullable: true })
  @IsOptional()
  middle_name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  last_name?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  date_of_birth?: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  bio?: string;

  @Field(() => Gender, { nullable: true })
  @IsOptional()
  gender?: Gender;
}
