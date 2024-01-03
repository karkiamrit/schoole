import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Type } from './enum/type.enum';

@InputType()
export class CreateInstitutionInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => Type)
  @IsNotEmpty()
  type: Type;
}

@InputType()
export class UpdateInstitutionInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => Type, { nullable: true })
  @IsOptional()
  type?: Type;
}
