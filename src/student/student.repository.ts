import { Student } from './entities/student.entity';
import { CustomRepository } from '../modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(Student)
export class StudentRepository extends Repository<Student> {}
