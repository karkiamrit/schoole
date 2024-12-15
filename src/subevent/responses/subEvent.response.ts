import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SubEvent } from '../entities/subEvent.entity';

@ObjectType()
export class SubEventResponse {
  @Field(() => [SubEvent])
  results: SubEvent[];

  @Field(() => Int)
  count: number;
}
