import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCertificateInput {
  @Field(() => String)
  @IsNotEmpty()
  certificate_name: string;
}

@InputType()
export class UpdateCertificateInput {
  @Field(() => String)
  @IsOptional()
  certificate_name: string;
}
