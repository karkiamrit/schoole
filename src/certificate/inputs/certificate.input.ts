import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCertificateInput {
  @Field(() => String)
  @IsNotEmpty()
  certificate_title?: string;

  @Field(() => String, { nullable: true }) // Assuming the file path will be a string
  @IsOptional() // Depending on your requirements, this field might not be required
  photo: string;
}

@InputType()
export class UpdateCertificateInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  certificate_title?: string;

  @Field(() => String, { nullable: true }) // Assuming the file path will be a string
  @IsOptional() // Depending on your requirements, this field might not be required
  photo?: string;
}
