import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from '../inputs/enums/role.enum';
import { Address } from '@/address/entities/address.entity';
import { UserType } from '@/user/inputs/enums/usertype.enum';
import { Student } from '@/student/entities/student.entity';
import { Institution } from '@/institution/entities/institution.entity';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
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

  @Field(() => UserType)
  @Column({ type: 'enum', enum: UserType, default: UserType.student })
  user_type: UserType;

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

  @OneToMany(() => Address, (address) => address.user, { eager: true })
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

@ObjectType()
export class CurrentUserType extends User {
  @Field(() => [Student], { nullable: true })
  student_details?: Student;

  @Field(() => [Institution], { nullable: true })
  institution_details?: Institution;
}
