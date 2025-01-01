import { GraphqlPassportAuthGuard } from '@/modules/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import GraphQLJSON from 'graphql-type-json';
import { GetManyInput, GetOneInput } from 'src/declare/inputs/custom.input';
import { GetUserType, User } from './entities/user.entity';
import {
  CreateUserInput,
  UpdateUserInput,
  UpdateUserWithStudentSocialsAndAddressInput,
} from './inputs/user.input';
import { CurrentQuery } from '@/modules/decorators/query.decorator';
import { CurrentUser } from '@/modules/decorators/user.decorator';
import { ApolloError } from 'apollo-server-core';
import { StudentService } from '@/student/student.service';
import { SubEvent } from '@/subevent/entities/subEvent.entity';
import { Role } from '@/user/inputs/enums/role.enum';
import { UserType } from '@/user/inputs/enums/usertype.enum';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly studentService: StudentService,
  ) {}

  @Query(() => GetUserType)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getManyUsers(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<User>,
    @CurrentQuery() query: string,
  ) {
    return this.userService.getMany(qs, query);
  }

  @Query(() => User || null)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  getOneUser(
    @Args({ name: 'input' })
    qs: GetOneInput<User>,
    @CurrentQuery() query: string,
  ) {
    return this.userService.getOne(qs, query);
  }

  @Mutation(() => User)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }

  @Mutation(() => [User])
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createManyUsers(
    @Args({ name: 'input', type: () => [CreateUserInput] })
    input: CreateUserInput[],
  ) {
    return this.userService.createMany(input);
  }

  @Mutation(() => User)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  updateUser(@Args('id') id: number, @Args('input') input: UpdateUserInput) {
    return this.userService.update(id, input);
  }

  // using in client
  @Mutation(() => User)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  async updateMe(
    @CurrentUser() user: User,
    @Args('input') input: UpdateUserWithStudentSocialsAndAddressInput,
  ) {
    return this.userService.updateUserProfile(user.id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  deleteUser(@Args('id') id: number) {
    return this.userService.delete(id);
  }

  @Query(() => User)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  getMe(@CurrentUser() user: User) {
    if (!user) {
      throw new ApolloError('Unauthorized access', 'FORBIDDEN', {
        statusCode: 403,
      });
    }
    if (
      (user && user.role !== Role.user) ||
      user.user_type !== UserType.student
    ) {
      throw new ApolloError('Unauthorized access', 'FORBIDDEN', {
        statusCode: 403,
      });
    }
    return user;
  }

  @Query(() => User)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getAdminMe(@CurrentUser() user: User) {
    if (!user) {
      throw new ApolloError('Unauthorized access', 'FORBIDDEN', {
        statusCode: 403,
      });
    }
    if (
      (user && user.role !== Role.Admin) ||
      user.user_type !== UserType.institution
    ) {
      throw new ApolloError('Unauthorized access', 'FORBIDDEN', {
        statusCode: 403,
      });
    }
    return user;
  }

  @Query(() => [SubEvent])
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  getMyParticipation(@CurrentUser() user: User) {
    if (!user) {
      throw new ApolloError('User Not Found', 'USER_NOT_FOUND', {
        statusCode: 404,
      });
    }
    if (!user.student) {
      throw new ApolloError('Student Not Found', 'STUDENT_NOT_FOUND', {
        statusCode: 404,
      });
    }
    return this.studentService.getStudentParticipation(user.student.id);
  }
}
