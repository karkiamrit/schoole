import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

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
}
