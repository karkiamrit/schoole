import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCertificateInput {
  @Field(() => String)
  @IsNotEmpty()
  title: string;
}

@InputType()
export class UpdateCertificateInput {
  @Field(() => String)
  @IsOptional()
  title: string;
}
