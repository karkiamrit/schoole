import { BadRequestException } from '@nestjs/common';
import { isPlainObject, isArray, merge } from 'lodash';
import {
  Between,
  In,
  IsNull,
  LessThan,
  ILike,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  FindOptionsWhere,
} from 'typeorm';
import { IWhere, OperatorType } from './types';

function processOperator<T>(prevKey: string, nextObject: OperatorType<T>) {
  const key = Object.keys(nextObject)[0];
  const value = nextObject[key];

  const operatorMap = new Map<string, Record<string, unknown>>([
    ['$eq', { [prevKey]: value }],
    ['$ne', { [prevKey]: Not(value) }],
    ['$lt', { [prevKey]: LessThan(value) }],
    ['$lte', { [prevKey]: LessThanOrEqual(value) }],
    ['$gt', { [prevKey]: MoreThan(value) }],
    ['$gte', { [prevKey]: MoreThanOrEqual(value) }],
    ['$in', { [prevKey]: In(value) }],
    ['$nIn', { [prevKey]: Not(In(value)) }],
    ['$contains', { [prevKey]: Like(`%${value}%`) }],
    ['$nContains', { [prevKey]: Not(Like(`%${value}%`)) }],
    ['$iContains', { [prevKey]: ILike(`%${value}%`) }],
    ['$nIContains', { [prevKey]: Not(ILike(`%${value}%`)) }],
    ['$null', { [prevKey]: IsNull() }],
    ['$nNull', { [prevKey]: Not(IsNull()) }],
    ['$between', { [prevKey]: Between(value[0], value[1]) }],
  ]);

  if (key.includes('$') && !operatorMap.has(key)) {
    throw new BadRequestException(`Invalid operator ${key} for ${prevKey}`);
  }

  if (operatorMap.has(key)) {
    return operatorMap.get(key);
  }

  return { [prevKey]: nextObject };
}

// function goDeep<T>(
//   filters: IWhere<T>,
//   keyStore: string[] = [],
//   _original: IWhere<T>,
// ) {
//   // Check if "and" expression
//   if (isPlainObject(filters) && Object.keys(filters).length > 1) {
//     const array = Object.entries(filters).map(([key, value]) => {
//       return goDeep({ [key]: value } as any, keyStore, {});
//     });

//     return array.reduce(
//       (prev: Record<string, unknown>, next: Record<string, unknown>) => {
//         return merge(prev, next);
//       },
//       {},
//     );
//   }

//   const thisKey = Object.keys(filters)[0];
//   let nextObject = filters[Object.keys(filters)[0]];

//   // Check if this item is on bottom
//   if (!isPlainObject(nextObject)) {
//     // In case use null as value
//     if (nextObject === null) {
//       return { [thisKey]: IsNull() };
//     }

//     nextObject = { $eq: nextObject };
//   }
//   const valueOfNextObjet = Object.values(nextObject)[0];

//   // Check if next item is on bottom
//   if (
//     !isPlainObject(valueOfNextObjet) &&
//     !(Object.keys(nextObject).length > 1)
//   ) {
//     const value = processOperator(thisKey, nextObject);

//     if (keyStore.length) {
//       set(_original, keyStore.join('.'), value);
//       keyStore = [];
//       return _original;
//     }
//     return { ..._original, ...value };
//   }

//   // In case object is plain and need to go deep
//   return goDeep(nextObject, [...keyStore, thisKey], _original);
// }

// export function processWhere<T>(
//   original: IWhere<T>,
// ): FindOptionsWhere<T> | FindOptionsWhere<T>[] {
//   // Check if "or" expression
//   if (isArray(original)) {
//     return original.map((where, i) => goDeep(where, [], original[i]));
//   }

//   return goDeep(original, [], original);
// }

export function processWhere<T>(
  original: any,
): FindOptionsWhere<T> | FindOptionsWhere<T>[] {
  return processNestedWhere(original);
}

// Recursive function to handle nested AND/OR operations with improved typing
export function processNestedWhere<T>(
  filters: IWhere<T> | IWhere<T>[],
): FindOptionsWhere<T> | FindOptionsWhere<T>[] {
  // If filters is a primitive or not an array/object, return as-is
  if (!isArray(filters) && !isPlainObject(filters)) {
    return filters as FindOptionsWhere<T>;
  }

  // If it's an array of arrays, handle nested AND/OR logic
  if (isArray(filters)) {
    // If all elements are arrays, it's an OR operation
    if (filters.every(isArray)) {
      return filters.map((subFilters) => {
        // Process each sub-array as an AND operation
        return subFilters.reduce((acc, filter) => {
          const processedFilter = processNestedWhere(filter);
          return merge(acc, processedFilter);
        }, {});
      }) as FindOptionsWhere<T>[];
    }

    // If it's a single-level array, treat as AND operation
    return filters.reduce((acc, filter) => {
      const processedFilter = processNestedWhere(filter);
      return merge(acc, processedFilter);
    }, {}) as FindOptionsWhere<T>;
  }

  // If it's a plain object, process each key
  if (isPlainObject(filters)) {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      // If value is an object with operators, process it
      if (
        isPlainObject(value) &&
        Object.keys(value).some((k) => k.startsWith('$'))
      ) {
        const processedOperator = processOperator(
          key,
          value as OperatorType<T>,
        );
        return merge(acc, processedOperator);
      }

      // Recursively process nested objects
      const processedValue = processNestedWhere(value);
      return merge(acc, { [key]: processedValue });
    }, {}) as FindOptionsWhere<T>;
  }

  return filters as FindOptionsWhere<T>;
}
