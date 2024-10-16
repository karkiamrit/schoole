import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { PaymentRepository } from './payment.repository';
import { Payment } from './entities/payment.entity';
import {
  CreatePaymentInput,
  ESewaPaymentInput,
  UpdatePaymentInput,
} from './inputs/payment.input';
import { createHmac } from 'crypto';
import { FindOneOptions } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as process from 'node:process';
import { SubEventService } from '@/subevent/subEvent.service';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly subEventService: SubEventService,
  ) {}

  getMany(qs?: RepoQuery<Payment>, query?: string) {
    return this.paymentRepository.getMany(qs || {}, query);
  }

  getOne(qs: OneRepoQuery<Payment>, query?: string) {
    if (query) {
      return this.paymentRepository.getOne(qs, query);
    } else {
      return this.paymentRepository.findOne(qs as FindOneOptions<Payment>);
    }
  }

  create(input: CreatePaymentInput): Promise<Payment> {
    const payment = new Payment();
    Object.assign(payment, input);
    return this.paymentRepository.save(payment);
  }

  createMany(input: CreatePaymentInput[]): Promise<Payment[]> {
    return this.paymentRepository.save(input);
  }

  async update(id: number, input: UpdatePaymentInput): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    return this.paymentRepository.save({ ...payment, ...input });
  }

  async delete(id: number) {
    const payment = this.paymentRepository.findOne({ where: { id } });
    await this.paymentRepository.delete({ id });
    return payment;
  }

  async createEsewaSignature(message: string) {
    const secret = process.env.ESEWA_PAYMENT_SECRET_KEY; //different in production
    const hmac = createHmac('sha256', secret);
    hmac.update(message);
    return hmac.digest('base64');
  }

  async createEsewaPaymentForm(payment_input: ESewaPaymentInput) {
    const transactionUUID = this.createEsewaTransactionUUId(
      payment_input.transaction_uuid,
    );
    const product_code = process.env.ESEWA_PRODUCT_CODE;
    const message = `total_amount=${payment_input.total_amount},transaction_uuid=${transactionUUID},product_code=${product_code}`;
    console.log(message, 'request message');
    const signature = await this.createEsewaSignature(message);
    return {
      ...payment_input,
      product_code: 'EPAYTEST',
      signature: signature,
      success_url: 'http://localhost:5000/payment/esewa-success',
      failure_url: 'http://localhost:3000/payment-failure',
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      transaction_uuid: transactionUUID,
    };
  }

  createEsewaTransactionUUId(product_id: string): string {
    const transactionUUID = uuidv4();
    const esewaTransactionId = `${product_id}-${transactionUUID}`;
    return esewaTransactionId;
  }

  extractSubEventIdFromTransactionUUID(transactionId: string): string {
    return transactionId.split('-')[0];
  }

  async checkEsewaSuccess(query: any, user: User) {
    try {
      const decodedData = JSON.parse(
        Buffer.from(query.data, 'base64').toString('utf-8'),
      );

      if (decodedData.status !== 'COMPLETE') {
        throw new HttpException(
          'Transaction not complete',
          HttpStatus.BAD_REQUEST,
        );
      }
      const message = decodedData.signed_field_names
        .split(',')
        .map((field: string | number) => `${field}=${decodedData[field] || ''}`)
        .join(',');
      const signature = await this.createEsewaSignature(message);

      if (signature !== decodedData.signature) {
        throw new HttpException('Integrity Error', HttpStatus.BAD_REQUEST);
      }
      const subEventId = parseInt(
        this.extractSubEventIdFromTransactionUUID(decodedData.transaction_uuid),
      );
      await this.subEventService.participate(subEventId, user, decodedData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
