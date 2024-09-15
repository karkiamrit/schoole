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

  getMany(qs?: RepoQuery<Student>, query?: string) {
    return this.studentRepository.getMany(qs || {}, query);
  }

  getOne(qs: OneRepoQuery<Student>, query?: string) {
    if (query) {
      return this.studentRepository.getOne(qs, query);
    } else {
      return this.studentRepository.findOne(qs as FindOneOptions<Student>);
    }
  }

  create(input: CreateStudentInput, user: User): Promise<Student> {
    const student = new Student();
    Object.assign(student, input);
    student.user = user;
    return this.studentRepository.save(student);
  }

  createMany(input: CreateStudentInput[]): Promise<Student[]> {
    return this.studentRepository.save(input);
  }

  async update(id: number, input: UpdateStudentInput): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    return this.studentRepository.save({ ...student, ...input });
  }

  async delete(id: number) {
    const student = this.studentRepository.findOne({ where: { id } });
    await this.studentRepository.delete({ id });
    return student;
  }

  async getStudentParticipation(id: number) {
    const student = await this.studentRepository.findOne({
      where: { id: id },
      relations: ['participatedSubEvents'],
    });

    return student.participatedSubEvents;
  }
}
