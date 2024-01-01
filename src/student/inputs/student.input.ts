import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Gender } from './enums/student.enum';
import { User } from 'src/user/entities/user.entity';

@InputType()
export class CreateStudentInput {
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

  @Field(() => String)
  @IsOptional()
  bio?: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  gender: Gender;

  @Field(() => Int, { nullable: false })
  @IsNotEmpty()
  user: User;
}

@InputType()
export class UpdateStudentInput {
  @Field(() => String)
  @IsOptional()
  first_name: string;
}
