import { GraphqlPassportAuthGuard } from '../modules/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventService } from './event.service';
import { GetManyInput, GetOneInput } from 'src/declare/inputs/custom.input';
import { CurrentQuery } from 'src/modules/decorators/query.decorator';
import { GetEventType, Event } from './entities/event.entity';
import {
  CreateEventInput,
  CreateEventWithSubEventsInput,
  UpdateEventInput,
} from './inputs/event.input';
import { CurrentUser } from '@/modules/decorators/user.decorator';
import { User } from '@/user/entities/user.entity';
@Resolver()
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(() => GetEventType)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  getManyEvents(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Event>,
    @CurrentQuery() query: string,
  ) {
    return this.eventService.getMany(qs, query);
  }

  @Query(() => Event)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getOneEvent(
    @Args({ name: 'input' })
    qs: GetOneInput<Event>,
    @CurrentQuery() query: string,
  ) {
    return this.eventService.getOne(qs, query);
  }

  @Mutation(() => Event)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  async createEventWithSubEvents(
    @Args('input') input: CreateEventWithSubEventsInput,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return this.eventService.createEventWithSubEvents(input, user);
  }

  @Mutation(() => Event)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createEvent(@Args('input') input: CreateEventInput) {
    return this.eventService.create(input, null);
  }

  @Mutation(() => Event)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  createEventByInstitution(
    @Args('input') input: CreateEventInput,
    @CurrentUser() user: User,
  ) {
    return this.eventService.create(input, user);
  }

  @Mutation(() => [Event])
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createManyEvent(
    @Args({ name: 'input', type: () => [CreateEventInput] })
    input: CreateEventInput[],
  ) {
    return this.eventService.createMany(input);
  }

  @Mutation(() => Event)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  updateEvent(@Args('id') id: number, @Args('input') input: UpdateEventInput) {
    return this.eventService.update(id, input);
  }

  @Mutation(() => Event)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  deleteEvent(@Args('id') id: number) {
    return this.eventService.delete(id);
  }
}
