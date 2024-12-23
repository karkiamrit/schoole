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
import { SubEventResponse } from './responses/subEvent.response';
@Resolver(() => SubEvent)
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

  @Query(() => SubEventResponse)
  async allEvents(
    @Args('whereFilter', { type: () => GraphQLJSON, nullable: true })
    whereFilter?: any,
    @Args('categories', { type: () => [String], nullable: true })
    categories?: string[],
    @Args('types', { type: () => [String], nullable: true }) types?: string[],
    @Args('startDate', { type: () => Date, nullable: true }) startDate?: Date,
    @Args('endDate', { type: () => Date, nullable: true }) endDate?: Date,
    @Args('registerationFeeLower', { type: () => Number, nullable: true })
    registerationFeeLower?: number,
    @Args('registerationFeeUpper', { type: () => Number, nullable: true })
    registerationFeeUpper?: number,
    @Args('page', { type: () => Number, nullable: true }) page?: number,
    @Args('size', { type: () => Number, nullable: true }) size?: number,
    @Args('orderBy', { type: () => String, nullable: true }) orderBy?: string,
    @Args('orderDirection', { type: () => String, nullable: true })
    orderDirection?: 'ASC' | 'DESC',
  ): Promise<SubEventResponse> {
    return this.subEventService.getAllEvents(
      whereFilter,
      categories,
      types,
      startDate,
      endDate,
      registerationFeeLower,
      registerationFeeUpper,
      page,
      size,
      orderBy,
      orderDirection,
    );
  }

  @Query(() => [GraphQLJSON])
  getEventForYou(
    @Args('interests', { type: () => [String] })
    interests: string[],
  ) {
    return this.subEventService.getEventsForYou(interests);
  }

  @Query(() => [GraphQLJSON])
  getEventNearMe(
    @Args('latitude', { type: () => Number }) latitude: number,
    @Args('longitude', { type: () => Number }) longitude: number,
  ) {
    return this.subEventService.getEventNearMe(latitude, longitude);
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
    @Args('options', { nullable: true, type: () => GraphQLJSON })
    options?: Record<string, any>,
  ) {
    return this.subEventService.participate(id, user, options);
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

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  async participateMany(
    @Args({ name: 'subEventId', type: () => Int }) subEventId: number,
    @Args({ name: 'studentIds', type: () => [Int] }) studentIds: number[],
  ) {
    return this.subEventService.participateMany(subEventId, studentIds);
  }
}
