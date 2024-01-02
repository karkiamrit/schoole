import { GraphqlPassportAuthGuard } from '../modules/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentService } from './student.service';
import { GetManyInput, GetOneInput } from 'src/declare/inputs/custom.input';
import { CurrentQuery } from 'src/modules/decorators/query.decorator';
import { GetStudentType, Student } from './entities/student.entity';
import { CreateStudentInput, UpdateStudentInput } from './inputs/student.input';
import { CurrentUser } from 'src/modules/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
@Resolver()
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => GetStudentType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyStudents(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Student>,
    @CurrentQuery() query: string,
  ) {
    return this.studentService.getMany(qs, query);
  }

  @Query(() => Student)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneStudent(
    @Args({ name: 'input' })
    qs: GetOneInput<Student>,
    @CurrentQuery() query: string,
  ) {
    return this.studentService.getOne(qs, query);
  }

  @Mutation(() => Student)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  createStudent(
    @Args('input') input: CreateStudentInput,
    @CurrentUser() user: User,
  ) {
    return this.studentService.create(input, user);
  }

  @Mutation(() => [Student])
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createManyStudent(
    @Args({ name: 'input', type: () => [CreateStudentInput] })
    input: CreateStudentInput[],
  ) {
    return this.studentService.createMany(input);
  }

  @Mutation(() => Student)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updateStudent(
    @Args('id') id: number,
    @Args('input') input: UpdateStudentInput,
  ) {
    return this.studentService.update(id, input);
  }

  @Mutation(() => Student)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deleteStudent(@Args('id') id: number) {
    return this.studentService.delete(id);
  }
}
