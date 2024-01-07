import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from '../inputs/enums/role.enum';
import { Address } from '@/address/entities/address.entity';
import { Student } from '@/student/entities/student.entity';
import { Institution } from '@/institution/entities/institution.entity';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Field(() => String)
  @Column({ nullable: true, unique: true })
  phone?: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Field(() => String)
  @Column({ nullable: true })
  profile_picture: string;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  last_login: Date;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => String)
  @Column({ unique: true })
  username: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: Role, default: Role.user })
  role: Role;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updated_at: Date;

  @Field()
  @Column({ default: false })
  email_verified: boolean;

  // reverse relationship fields
  @OneToOne(() => Student, (student) => student.user)
  student: Student;

  @OneToOne(() => Institution, (institution) => institution.user)
  institution: Institution;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @BeforeInsert()
  async beforeInsert() {
    if (!this.role) {
      this.role = Role.user;
    }
  }
}

@ObjectType()
export class GetUserType {
  @Field(() => [User], { nullable: true })
  data?: User[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
