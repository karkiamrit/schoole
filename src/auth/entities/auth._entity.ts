import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class JwtWithUser {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class OnlyJwt {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}