import { GraphqlPassportAuthGuard } from '../modules/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompetitionService } from './competition.service';
import { GetManyInput, GetOneInput } from 'src/declare/inputs/custom.input';
import { CurrentQuery } from 'src/modules/decorators/query.decorator';
import { GetCompetitionType, Competition } from './entities/competition.entity';
import {
  CreateCompetitionInput,
  UpdateCompetitionInput,
} from './inputs/competition.input';
import GraphQLJSON from 'graphql-type-json';
import { User } from '@/user/entities/user.entity';
import { CurrentUser } from '@/modules/decorators/user.decorator';
@Resolver()
export class CompetitionResolver {
  constructor(private readonly competitionService: CompetitionService) {}

  @Query(() => GetCompetitionType)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getManyCompetitions(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Competition>,
    @CurrentQuery() query: string,
  ) {
    return this.competitionService.getMany(qs, query);
  }

  @Query(() => Competition)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getOneCompetition(
    @Args({ name: 'input' })
    qs: GetOneInput<Competition>,
    @CurrentQuery() query: string,
  ) {
    return this.competitionService.getOne(qs, query);
  }

  @Mutation(() => Competition)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createCompetition(
    @Args('input') input: CreateCompetitionInput,
    @Args('eventID') eventID: number,
  ) {
    return this.competitionService.create(input, eventID);
  }

  @Mutation(() => [Competition])
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createManyCompetition(
    @Args({ name: 'input', type: () => [CreateCompetitionInput] })
    input: CreateCompetitionInput[],
  ) {
    return this.competitionService.createMany(input);
  }

  @Mutation(() => Competition)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  updateCompetition(
    @Args('id') id: number,
    @Args('input') input: UpdateCompetitionInput,
  ) {
    return this.competitionService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  participateInCompetition(
    @Args('competitionID') id: number,
    @CurrentUser() user: User,
  ) {
    return this.competitionService.participate(id, user);
  }

  @Mutation(() => Competition)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  deleteCompetition(@Args('id') id: number) {
    return this.competitionService.delete(id);
  }
}
