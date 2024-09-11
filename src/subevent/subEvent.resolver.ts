import { GraphqlPassportAuthGuard } from '../modules/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SubEventService } from './subEvent.service';
import { GetManyInput, GetOneInput } from 'src/declare/inputs/custom.input';
import { CurrentQuery } from 'src/modules/decorators/query.decorator';
import { GetSubEventType, SubEvent } from './entities/subEvent.entity';
import {
  CreateSubEventInput,
  UpdateSubEventInput,
} from './inputs/subEvent.input';
import GraphQLJSON from 'graphql-type-json';
import { User } from '@/user/entities/user.entity';
import { CurrentUser } from '@/modules/decorators/user.decorator';
import { UserRepository } from '@/user/user.repository';
import { Participant } from '@/participant/entities/participant.entity';
@Resolver()
export class SubEventResolver {
  constructor(
    private readonly subEventService: SubEventService,
    private readonly userRepository: UserRepository,
  ) {}

  @Query(() => GetSubEventType)
  // @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getManySubEvents(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<SubEvent>,
    @CurrentQuery() query: string,
  ) {
    return this.subEventService.getMany(qs, query);
  }

  @Query(() => SubEvent)
  // @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getOneSubEvent(
    @Args({ name: 'input' })
    qs: GetOneInput<SubEvent>,
    @CurrentQuery() query: string,
  ) {
    return this.subEventService.getOne(qs, query);
  }

  @Mutation(() => SubEvent)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  createSubEvent(
    @Args('input') input: CreateSubEventInput,
    @Args('eventID') eventID: number,
  ) {
    return this.subEventService.create(input, eventID);
  }

  @Mutation(() => [SubEvent])
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createManySubEvent(
    @Args({ name: 'input', type: () => [CreateSubEventInput] })
    input: CreateSubEventInput[],
  ) {
    return this.subEventService.createMany(input);
  }

  @Mutation(() => SubEvent)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  updateSubEvent(
    @Args('id') id: number,
    @Args('input') input: UpdateSubEventInput,
  ) {
    return this.subEventService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  participateInSubEvent(
    @Args('SubEventID') id: number,
    @CurrentUser() user: User,
  ) {
    return this.subEventService.participate(id, user);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  async allocateStudentToSubEvent(
    @Args('subEventId') subEventID: number,
    @Args('userId') userId: number,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return this.subEventService.participate(subEventID, user);
  }

  @Mutation(() => SubEvent)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  deleteSubEvent(@Args('id') id: number) {
    return this.subEventService.delete(id);
  }

  @Mutation(() => [Participant])
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  async participateMany(
    @Args({ name: 'subEventId', type: () => Int }) subEventId: number,
    @Args({ name: 'studentIds', type: () => [Int] }) studentIds: number[],
  ) {
    return this.subEventService.participateMany(subEventId, studentIds);
  }
}
