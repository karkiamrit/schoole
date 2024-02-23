import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Address } from '@/address/entities/address.entity';
import { Institution } from '@/institution/entities/institution.entity';
import { Competition } from '@/competition/entities/competition.entity';

@ObjectType()
@Entity('events')
export class Event {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @OneToOne(() => Address, (address) => address.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Field(() => Address)
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address: Address;

  @OneToMany(() => Competition, (competition) => competition.event)
  @Field(() => [Competition])
  competitions: Competition[];

  @ManyToMany(() => Institution, (institution) => institution.events, {
    eager: true,
  })
  @JoinTable()
  @Field(() => [Institution])
  institutions: Institution[];

  @Field(() => Date)
  @Column()
  start_date: Date;

  @Field(() => Date)
  @Column()
  end_date: Date;

  @Field()
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  created_at: Date;

  @Field()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updated_at: Date;
}

@ObjectType()
export class GetEventType {
  @Field(() => [Event], { nullable: true })
  data?: Event[];

  @Field(() => Number, { nullable: true })
  count?: number;
}