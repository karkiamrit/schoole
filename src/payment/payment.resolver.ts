import { GraphqlPassportAuthGuard } from '../modules/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { GetManyInput, GetOneInput } from 'src/declare/inputs/custom.input';
import { CurrentQuery } from 'src/modules/decorators/query.decorator';
import { GetPaymentType, Payment } from './entities/payment.entity';
import {
  CreatePaymentInput,
  ESewaPaymentInput,
  UpdatePaymentInput,
} from './inputs/payment.input';
import GraphQLJSON from 'graphql-type-json';
@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Query(() => GetPaymentType)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getManyPayments(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Payment>,
    @CurrentQuery() query: string,
  ) {
    return this.paymentService.getMany(qs, query);
  }

  @Query(() => Payment)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  getOnePayment(
    @Args({ name: 'input' })
    qs: GetOneInput<Payment>,
    @CurrentQuery() query: string,
  ) {
    return this.paymentService.getOne(qs, query);
  }

  @Mutation(() => Payment)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createPayment(@Args('input') input: CreatePaymentInput) {
    return this.paymentService.create(input);
  }

  @Mutation(() => [Payment])
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  createManyPayment(
    @Args({ name: 'input', type: () => [CreatePaymentInput] })
    input: CreatePaymentInput[],
  ) {
    return this.paymentService.createMany(input);
  }

  @Mutation(() => Payment)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  updatePayment(
    @Args('id') id: number,
    @Args('input') input: UpdatePaymentInput,
  ) {
    return this.paymentService.update(id, input);
  }

  @Mutation(() => Payment)
  @UseGuards(new GraphqlPassportAuthGuard('Admin'))
  deletePayment(@Args('id') id: number) {
    return this.paymentService.delete(id);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard(''))
  getEsewaPaymentForm(@Args('payment_input') payment_input: ESewaPaymentInput) {
    console.log(payment_input);
    return this.paymentService.createEsewaPaymentForm(payment_input);
  }
}
