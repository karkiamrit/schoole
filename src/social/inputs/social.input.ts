import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUrl } from 'class-validator';
import { SocialType } from '@/social/inputs/enums/social_type.enum';

@InputType()
export class CreateSocialInput {
  @Field(() => SocialType)
  @IsNotEmpty()
  @IsEnum(SocialType)
  social_type: SocialType;

  @Field(() => String)
  @IsNotEmpty()
  @IsUrl()
  social_link: string;

  @Field(() => Number)
  @IsNotEmpty()
  user_id: number;
}

@InputType()
export class UpdateSocialInput {
  @Field(() => SocialType)
  @IsNotEmpty()
  @IsEnum(SocialType)
  social_type: SocialType;

  @Field(() => String)
  @IsNotEmpty()
  @IsUrl()
  social_link: string;
}
