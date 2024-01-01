import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { AddressRepository } from './address.repository';
import { Address } from './entities/address.entity';
import { CreateAddressInput, UpdateAddressInput } from './inputs/address.input';

import { FindOneOptions } from 'typeorm';
@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  getMany(qs?: RepoQuery<Address>, query?: string) {
    return this.addressRepository.getMany(qs || {}, query);
  }

  getOne(qs: OneRepoQuery<Address>, query?: string) {
    if (query) {
      return this.addressRepository.getOne(qs, query);
    } else {
      return this.addressRepository.findOne(qs as FindOneOptions<Address>);
    }
  }

  create(input: CreateAddressInput): Promise<Address> {
    const address = new Address();
    Object.assign(address, input);
    return this.addressRepository.save(address);
  }

  async update(id: number, input: UpdateAddressInput): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id } });
    return this.addressRepository.save({ ...address, ...input });
  }

  async delete(id: number) {
    const address = this.addressRepository.findOne({ where: { id } });
    await this.addressRepository.delete({ id });
    return address;
  }
}
