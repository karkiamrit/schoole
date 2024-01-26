import { GraphqlPassportAuthGuard } from '../modules/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrganizerService } from './organizer.service';
import { GetManyInput, GetOneInput } from 'src/declare/inputs/custom.input';
import { CurrentQuery } from 'src/modules/decorators/query.decorator';
import { GetOrganizerType, Organizer } from './entities/organizer.entity';
import {
  CreateOrganizerInput,
  UpdateOrganizerInput,
} from './inputs/organizer.input';
@Resolver()
export class OrganizerResolver {
  constructor(private readonly organizerService: OrganizerService) {}

  @Query(() => GetOrganizerType)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getManyOrganizers(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Organizer>,
    @CurrentQuery() query: string,
  ) {
    return this.organizerService.getMany(qs, query);
  }

  @Query(() => Organizer)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getOneOrganizer(
    @Args({ name: 'input' })
    qs: GetOneInput<Organizer>,
    @CurrentQuery() query: string,
  ) {
    return this.organizerService.getOne(qs, query);
  }

  @Mutation(() => Organizer)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createOrganizer(@Args('input') input: CreateOrganizerInput) {
    return this.organizerService.create(input);
  }

  @Mutation(() => [Organizer])
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createManyOrganizer(
    @Args({ name: 'input', type: () => [CreateOrganizerInput] })
    input: CreateOrganizerInput[],
  ) {
    return this.organizerService.createMany(input);
  }

  @Mutation(() => Organizer)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  updateOrganizer(
    @Args('id') id: number,
    @Args('input') input: UpdateOrganizerInput,
  ) {
    return this.organizerService.update(id, input);
  }

  @Mutation(() => Organizer)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  deleteOrganizer(@Args('id') id: number) {
    return this.organizerService.delete(id);
  }
}
