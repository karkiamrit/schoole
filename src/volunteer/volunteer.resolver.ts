import { GraphqlPassportAuthGuard } from '../modules/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VolunteerService } from './volunteer.service';
import { GetManyInput, GetOneInput } from 'src/declare/inputs/custom.input';
import { CurrentQuery } from 'src/modules/decorators/query.decorator';
import { GetVolunteerType, Volunteer } from './entities/volunteer.entity';
import {
  CreateVolunteerInput,
  UpdateVolunteerInput,
} from './inputs/volunteer.input';
@Resolver()
export class VolunteerResolver {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Query(() => GetVolunteerType)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getManyVolunteers(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Volunteer>,
    @CurrentQuery() query: string,
  ) {
    return this.volunteerService.getMany(qs, query);
  }

  @Query(() => Volunteer)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getOneVolunteer(
    @Args({ name: 'input' })
    qs: GetOneInput<Volunteer>,
    @CurrentQuery() query: string,
  ) {
    return this.volunteerService.getOne(qs, query);
  }

  @Mutation(() => Volunteer)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createVolunteer(@Args('input') input: CreateVolunteerInput) {
    return this.volunteerService.create(input);
  }

  @Mutation(() => [Volunteer])
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createManyVolunteer(
    @Args({ name: 'input', type: () => [CreateVolunteerInput] })
    input: CreateVolunteerInput[],
  ) {
    return this.volunteerService.createMany(input);
  }

  @Mutation(() => Volunteer)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  updateVolunteer(
    @Args('id') id: number,
    @Args('input') input: UpdateVolunteerInput,
  ) {
    return this.volunteerService.update(id, input);
  }

  @Mutation(() => Volunteer)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  deleteVolunteer(@Args('id') id: number) {
    return this.volunteerService.delete(id);
  }
}
