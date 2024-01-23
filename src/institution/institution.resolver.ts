import { GraphqlPassportAuthGuard } from '../modules/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InstitutionService } from './institution.service';
import { GetManyInput, GetOneInput } from 'src/declare/inputs/custom.input';
import { CurrentQuery } from 'src/modules/decorators/query.decorator';
import { GetInstitutionType, Institution } from './entities/institution.entity';
import {
  CreateInstitutionInput,
  UpdateInstitutionInput,
} from './inputs/institution.input';
import { CurrentUser } from 'src/modules/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
@Resolver()
export class InstitutionResolver {
  constructor(private readonly institutionService: InstitutionService) {}

  @Query(() => GetInstitutionType)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getManyInstitutions(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Institution>,
    @CurrentQuery() query: string,
  ) {
    return this.institutionService.getMany(qs, query);
  }

  @Query(() => Institution)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getOneInstitution(
    @Args({ name: 'input' })
    qs: GetOneInput<Institution>,
    @CurrentQuery() query: string,
  ) {
    return this.institutionService.getOne(qs, query);
  }

  @Mutation(() => Institution)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createInstitution(
    @Args('input') input: CreateInstitutionInput,
    @CurrentUser() user: User,
  ) {
    return this.institutionService.create(input, user);
  }

  @Mutation(() => [Institution])
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createManyInstitution(
    @Args({ name: 'input', type: () => [CreateInstitutionInput] })
    input: CreateInstitutionInput[],
  ) {
    return this.institutionService.createMany(input);
  }

  @Mutation(() => Institution)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  updateInstitution(
    @Args('id') id: number,
    @Args('input') input: UpdateInstitutionInput,
  ) {
    return this.institutionService.update(id, input);
  }

  @Mutation(() => Institution)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  deleteInstitution(@Args('id') id: number) {
    return this.institutionService.delete(id);
  }
}
