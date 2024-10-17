import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { PaymentRepository } from './payment.repository';
import { Payment } from './entities/payment.entity';
import {
  CreatePaymentInput,
  ESewaPaymentInput,
  KhaltiPaymentInput,
  UpdatePaymentInput,
} from './inputs/payment.input';
import { createHmac } from 'crypto';
import { FindOneOptions } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as process from 'node:process';
import { SubEventService } from '@/subevent/subEvent.service';
import { User } from '@/user/entities/user.entity';
import axios from 'axios';
import { ApolloError } from 'apollo-server-core';
import { PaymentMethods } from '@/payment/inputs/payment.enum';

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

  async createEsewaPaymentForm(paymentInput: ESewaPaymentInput) {
    const transactionUUID = this.createEsewaTransactionUUId(
      paymentInput.transaction_uuid,
    );
    const product_code = process.env.ESEWA_PRODUCT_CODE;
    const message = `total_amount=${paymentInput.total_amount},transaction_uuid=${transactionUUID},product_code=${product_code}`;
    const signature = await this.createEsewaSignature(message);
    return {
      ...paymentInput,
      product_code: 'EPAYTEST',
      signature: signature,
      success_url: process.env.ESEWA_PAYMENT_SUCESS_URL,
      failure_url: process.env.PAYMENT_FAILURE_URL,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      transaction_uuid: transactionUUID,
    };
  }

  createEsewaTransactionUUId(productId: string): string {
    const transactionUUID = uuidv4();
    const esewaTransactionId = `${productId}-${transactionUUID}`;
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
      await this.subEventService.participate(subEventId, user, {
        ...decodedData,
        payment_method: PaymentMethods.ESEWA,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async processKhaltiPayment(paymentInput: KhaltiPaymentInput) {
    const khaltiPayload = this.getKhaltiPaymentPayload(paymentInput);
    return await this.postKhaltiPayment(khaltiPayload);
  }

  getKhaltiPaymentPayload(paymentInput: Record<string, any>) {
    return {
      return_url: process.env.KHALTI_PAYMENT_SUCESS_URL,
      website_url: process.env.KHALTI_PAYMENT_WEBSITE_URL,
      amount: paymentInput.amount,
      purchase_order_id: this.createEsewaTransactionUUId(
        paymentInput.sub_event_id,
      ),
      purchase_order_name: paymentInput.product_name,
      merchant_event_id: paymentInput.sub_event_id,
    };
  }

  async postKhaltiPayment(khaltiPayload: Record<string, any>) {
    try {
      const response = await axios.post(
        process.env.KHALTI_PAYMENT_API,
        khaltiPayload,
        {
          headers: {
            Authorization: `key ${process.env.KHALTI_LIVE_SECRET_KEY}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new ApolloError(error.message, 'INTERNAL_SERVER_ERROR', {
        statusCode: 500,
      });
    }
  }

  async handleKhaltiSucess(query: any, user: User) {
    const validatedData = await this.validateKhaltiTransaction(query.pidx);
    const decodedData = {
      ...validatedData,
      transaction_code: validatedData.transaction_id,
      total_amount: validatedData.total_amount / 100,
      status: validatedData.status,
      transaction_uuid: validatedData.pidx,
      event_id: query.event_id,
      payment_method: PaymentMethods.KHALTI,
    };
    const jsonString = JSON.stringify(decodedData);
    const base64String = btoa(jsonString);
    if ((validatedData.status = 'Completed')) {
      await this.subEventService.participate(query.event_id, user, decodedData);
      return base64String;
    } else {
      throw new HttpException(
        'Transaction Verification Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateKhaltiTransaction(pidx: string) {
    try {
      const response = await axios.post(
        process.env.KHALTI_PAYMENT_LOOKUP_API,
        {
          pidx,
        },
        {
          headers: {
            Authorization: `key ${process.env.KHALTI_LIVE_SECRET_KEY}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new ApolloError(error.message, 'INTERNAL_SERVER_ERROR', {
        statusCode: 500,
      });
    }
  }
}
