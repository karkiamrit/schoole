import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { SubEvent } from '../entities/subEvent.entity';

@ObjectType()
export class SubEventResponse {
  @Field(() => [GraphQLJSON])
  results: SubEvent[];

  @Field(() => Int)
  count: number;
}
