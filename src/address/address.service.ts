import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { AddressRepository } from './address.repository';
import { Address } from './entities/address.entity';
import { CreateAddressInput, UpdateAddressInput } from './inputs/address.input';

import { FindOneOptions } from 'typeorm';

/**
 * AddressService is a service class responsible for handling CRUD operations
 * related to the Address entity. It encapsulates the interaction with the
 * AddressRepository to perform database operations.**/
@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

    /**
   * Retrieves multiple addresses based on optional query parameters.
   *
   * @param {RepoQuery<Address>} qs - Optional query parameters for filtering.
   * @param {string} query - Additional query string.
   * @returns {Promise<Address[]>} - A promise resolving to an array of addresses.
   */

  getMany(qs?: RepoQuery<Address>, query?: string) {
    return this.addressRepository.getMany(qs || {}, query);
  }

   /**
   * Retrieves a single address based on specified query parameters.
   *
   * @param {OneRepoQuery<Address>} qs - Query parameters for fetching a single address.
   * @param {string} query - Additional query string.
   * @returns {Promise<Address>} - A promise resolving to a single address.
   */

  getOne(qs: OneRepoQuery<Address>, query?: string) {
    if (query) {
      return this.addressRepository.getOne(qs, query);
    } else {
      return this.addressRepository.findOne(qs as FindOneOptions<Address>);
    }
  }
/**
   * Creates a new address using the provided input data.
   *
   * @param {CreateAddressInput} input - Input data for creating the address.
   * @returns {Promise<Address>} - A promise resolving to the created address.
   */
  create(input: CreateAddressInput): Promise<Address> {
    const address = new Address();
    Object.assign(address, input);
    return this.addressRepository.save(address);
  }
    /**
   * Creates multiple addresses using an array of input data.
   *
   * @param {CreateAddressInput[]} input - Array of input data for creating addresses.
   * @returns {Promise<Address[]>} - A promise resolving to an array of created addresses.
   */

  createMany(input: CreateAddressInput[]): Promise<Address[]> {
    return this.addressRepository.save(input);
  }
 /**
   * Updates an existing address with the provided input data.
   *
   * @param {number} id - The ID of the address to be updated.
   * @param {UpdateAddressInput} input - Input data for updating the address.
   * @returns {Promise<Address>} - A promise resolving to the updated address.
   */
  async update(id: number, input: UpdateAddressInput): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id } });
    return this.addressRepository.save({ ...address, ...input });
  }
    /**
   * Deletes an address based on the provided ID.
   *
   * @param {number} id - The ID of the address to be deleted.
   * @returns {Promise<Address>} - A promise resolving to the deleted address.
   */

  async delete(id: number) {
    const address = this.addressRepository.findOne({ where: { id } });
    await this.addressRepository.delete({ id });
    return address;
  }
}
