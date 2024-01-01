// import { IsEmail } from 'class-validator';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';


@ObjectType()
@Entity()
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

  @Column()
  password: string;

  @Field(() => String)
  @Column({ unique: true })
  username: string;

  @Field(() => String, { defaultValue: 'user' })
  @Column()
  role: 'admin' | 'user';

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @Field(() => Number)
  @Column()
  avatar?: number;

  @Field()
  @Column({ default: false })
  email_verified: boolean;
  
  // @Field({ nullable: true })
  // @Column({ nullable: true })
  // reset_token?: number;

  @BeforeInsert()
  async beforeInsert() {
    if (!this.role) {
      this.role = 'user';
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
