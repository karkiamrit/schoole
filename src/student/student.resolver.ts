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
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getManyStudents(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Student>,
    @CurrentQuery() query: string,
  ) {
    return this.studentService.getMany(qs, query);
  }

  /**
   * Get a single student by ID.
   *
   * @param {GetOneInput<Student>} qs - Input containing the ID of the student to retrieve.
   * @param {string} query - Current query parameter (replace with the actual type if not string).
   * @returns {Student} - The retrieved student.
   */
  @Query(() => Student)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  getOneStudent(
    @Args({ name: 'input' })
    qs: GetOneInput<Student>,
    @CurrentQuery() query: string,
  ) {
    return this.studentService.getOne(qs, query);
  }

  @Mutation(() => Student)
  @UseGuards(new GraphqlPassportAuthGuard('User'))
  createStudent(
    @Args('input') input: CreateStudentInput,
    @CurrentUser() user: User,
  ) {
    return this.studentService.create(input, user);
  }

  @Mutation(() => [Student])
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createManyStudent(
    @Args({ name: 'input', type: () => [CreateStudentInput] })
    input: CreateStudentInput[],
  ) {
    return this.studentService.createMany(input);
  }

  @Mutation(() => Student)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  updateStudent(
    @Args('id') id: number,
    @Args('input') input: UpdateStudentInput,
  ) {
    return this.studentService.update(id, input);
  }

  @Mutation(() => Student)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  deleteStudent(@Args('id') id: number) {
    return this.studentService.delete(id);
  }
}
