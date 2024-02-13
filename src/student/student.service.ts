import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { StudentRepository } from './student.repository';
import { Student } from './entities/student.entity';
import { CreateStudentInput, UpdateStudentInput } from './inputs/student.input';

import { FindOneOptions } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}
  /**
   * Retrieves multiple students based on provided query parameters.
   * @param qs - Query parameters for the student repository.
   * @param query - General query parameter.
   * @returns A list of students.
   */
  getMany(qs?: RepoQuery<Student>, query?: string) {
    return this.studentRepository.getMany(qs || {}, query);
  }
  /**
   * Retrieves a single student based on provided query parameters.
   * @param qs - Query parameters for the student repository.
   * @param query - General query parameter.
   * @returns A single student.
   */
  getOne(qs: OneRepoQuery<Student>, query?: string) {
    if (query) {
      return this.studentRepository.getOne(qs, query);
    } else {
      return this.studentRepository.findOne(qs as FindOneOptions<Student>);
    }
  }
  /**
   * Creates a new student associated with a user.
   * @param input - Student details.
   * @param user - User associated with the student.
   * @returns The created student.
   */
  create(input: CreateStudentInput, user: User): Promise<Student> {
    const student = new Student();
    Object.assign(student, input);
    student.user = user;
    return this.studentRepository.save(student);
  }
 /**
   * Creates multiple students.
   * @param input - Array of student details.
   * @returns An array of created students.
   */
  createMany(input: CreateStudentInput[]): Promise<Student[]> {
    return this.studentRepository.save(input);
  } 
   /**
  * Updates an existing student by its ID.
  * @param id - ID of the student to be updated.
  * @param input - Updated student details.
  * @returns The updated student.
  */

  async update(id: number, input: UpdateStudentInput): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    return this.studentRepository.save({ ...student, ...input });
  }
  /**
   * Deletes a student by its ID.
   * @param id - ID of the student to be deleted.
   * @returns The deleted student.
   */
  async delete(id: number) {
    const student = this.studentRepository.findOne({ where: { id } });
    await this.studentRepository.delete({ id });
    return student;
  }
}
