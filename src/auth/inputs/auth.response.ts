import { User } from '@/user/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class RefreshTokenResponse {
  @Field(() => String)
  refreshToken: string;

  @Field(() => String)
  accessToken: string;
}

@ObjectType()
export class JwtWithUser extends RefreshTokenResponse {
  @Field(() => User)
  user: User;
}
