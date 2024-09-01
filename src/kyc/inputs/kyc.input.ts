import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int } from "@nestjs/graphql";
import { Institution } from '@/institution/entities/institution.entity';
import { DeepPartial } from 'typeorm';
import { Volunteer } from '@/volunteer/entities/volunteer.entity';

@InputType()
export class CreateKycInput {
  @Field(() => Number)
  @IsOptional()
  institution?: DeepPartial<Institution>;

  @Field(() => Number)
  @IsOptional()
  volunteer?: DeepPartial<Volunteer>;

  @Field(() => String)
  @IsNotEmpty()
  kyc_type: string;

  @Field(() => String)
  @IsNotEmpty()
  kyc_document: string;
}

@InputType()
export class UpdateKycInput {
  @Field(() => String)
  @IsOptional()
  established_on: string;
}
