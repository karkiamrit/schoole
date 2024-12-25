import { SubEvent } from './entities/subEvent.entity';
import { CustomRepository } from '@/modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';
import { Address } from '@/address/entities/address.entity';
import { Event } from '@/event/entities/event.entity';
import { User } from '@/user/entities/user.entity';
import { Institution } from '@/institution/entities/institution.entity';
import { Brackets } from 'typeorm';

@CustomRepository(SubEvent)
export class SubEventRepository extends Repository<SubEvent> {
  async allEvent(
    whereFilter: any,
    categories?: string[],
    types?: string[],
    startDate?: Date,
    endDate?: Date,
    registrationFeeLower?: number,
    registrationFeeUpper?: number,
    page: number = 1,
    size: number = 10,
    orderBy: string = 'participant_count',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
  ) {
    const query = this.createQueryBuilder('se')
      .select([
        'se.id AS id',
        'se.name AS name',
        'se.type AS type',
        'se.category AS category',
        'se.start_date AS start_date',
        'se.end_date AS end_date',
        'se.registration_fee AS registration_fee',
        'ad.display_name AS address',
        'e.name AS event_name',
        'e.id AS event_id',
        'ad.display_name AS display_name',
        'se.is_online AS is_online',
        'se.banner AS banner',
        'se.displayPicture AS displayPicture',
        'se.participant_count AS participant_count',
        'i.name AS organizer',
      ])
      .innerJoin('events', 'e', 'se.event_id = e.id')
      .innerJoin('users', 'u', 'se.created_by = u.id')
      .leftJoin('institutions', 'i', 'i.user_id = u.id')
      .leftJoin('addresses', 'ad', 'ad.id = se.address_id');

    if (whereFilter && Object.keys(whereFilter).length > 0) {
      query.andWhere('se.name ILIKE :name', { name: `%${whereFilter.name}%` });
    }
    if (startDate) {
      query.andWhere('se.start_date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('se.end_date <= :endDate', { endDate });
    }

    if (categories && categories.length > 0) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            `ARRAY(SELECT TRIM(elem) FROM UNNEST(string_to_array(se.category, ',')) AS elem) && ARRAY[:...categories]`,
            { categories },
          );
        }),
      );
    }

    if (types && types.length > 0) {
      query.andWhere('se.type IN (:...types)', { types });
    }
    if (
      registrationFeeLower !== undefined &&
      registrationFeeUpper !== undefined
    ) {
      query.andWhere(
        new Brackets((qb: any) => {
          qb.where('se.registration_fee >= :registrationFeeLower', {
            registrationFeeLower,
          }).andWhere('se.registration_fee <= :registrationFeeUpper', {
            registrationFeeUpper,
          });
        }),
      );
    }

    query.orderBy(
      `se.${orderBy || 'createdAt'}`,
      orderDirection.toUpperCase() as 'ASC' | 'DESC',
    );

    const data = await query
      .offset((page - 1) * size)
      .limit(size)
      .getRawMany();

    const count = await query.getCount();

    return { results: data, count };
  }

  async eventForYou(categories: string[]) {
    const withInterestQuery = this.createQueryBuilder('se')
      .select([
        'se.id as id',
        'se.name as name',
        'se.type as type',
        'se.category as category',
        'se.start_date as "start_date"',
        'se.end_date as "end_date"',
        'e.name as "event_name"',
        'e.id as "event_id"',
        'ad.display_name as "display_name"',
        'se.is_online',
        'se.banner as banner',
        'se.participant_count as "participant_count"',
        'i.name as "organizer"',
      ])
      .innerJoin(Event, 'e', 'se.event_id = e.id')
      .innerJoin(User, 'u', 'se.created_by =  u.id')
      .leftJoin(Institution, 'i', 'u.id = i.user_id')
      .leftJoin(Address, 'ad', 'ad.id = se.address_id')
      .where(
        "ARRAY (SELECT TRIM(elem) FROM  UNNEST(string_to_array(se.category, ',')) AS elem) && ARRAY[:categories]",
        {
          categories: categories,
        },
      )
      .andWhere('se.start_date >= CURRENT_DATE')
      .orderBy('se.participant_count', 'DESC')
      .limit(5);
    const withoutInterestQuery = this.createQueryBuilder('se')
      .select([
        'se.id as id',
        'se.name as name',
        'se.type as type',
        'se.category as category',
        'se.start_date as "start_date"',
        'se.end_date as "end_date"',
        'e.name as "event_name"',
        'e.id as "event_id"',
        'ad.display_name as "display_name"',
        'se.is_online',
        'se.banner as banner',
        'se.displayPicture as displayPicture',
        'se.participant_count as "participant_count"',
        'i.name as "organizer"',
      ])
      .innerJoin(Event, 'e', 'se.event_id = e.id')
      .innerJoin(User, 'u', 'se.created_by =  u.id')
      .leftJoin(Institution, 'i', 'u.id = i.user_id')
      .leftJoin(Address, 'ad', 'ad.id = se.address_id')
      .where('se.start_date >= CURRENT_DATE')
      .orderBy('se.participant_count', 'DESC');

    const withInterestResults = await withInterestQuery.getRawMany();
    const uniqueIds = new Set(withInterestResults.map((result) => result.id));
    const remainingCount = 5 - uniqueIds.size;

    let additionalResults = [];
    if (uniqueIds.size > 0 && remainingCount > 0) {
      additionalResults = await withoutInterestQuery
        .andWhere('se.id NOT IN (:...existingIds)', {
          existingIds: Array.from(uniqueIds),
        })
        .limit(remainingCount)
        .getRawMany();
    } else if (remainingCount > 0) {
      additionalResults = await withoutInterestQuery
        .limit(remainingCount)
        .getRawMany();
    }
    withInterestResults.push(...additionalResults);

    return withInterestResults.slice(0, 5);
  }

  async eventNearMe(latitude: number, longitude: number) {
    const radiusInKm = 10;

    return await this.createQueryBuilder('se')
      .select([
        'se.id AS id',
        'se.name AS name',
        'se.type AS type',
        'se.category AS category',
        'se.start_date AS start_date',
        'se.end_date AS end_date',
        'e.name AS event_name',
        'e.id AS event_id',
        'ad.display_name AS display_name',
        'se.is_online',
        'se.banner AS banner',
        'se.displayPicture as displayPicture',
        'se.participant_count AS participant_count',
        'i.name AS organizer',
      ])
      .addSelect(
        `(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(ad.latitude::numeric)) 
            * cos(radians(ad.longitude::numeric) - radians(:longitude)) 
            + sin(radians(:latitude)) * sin(radians(ad.latitude::numeric))
          )
      )`,
        'distance',
      )
      .innerJoin('events', 'e', 'se.event_id = e.id')
      .innerJoin('users', 'u', 'se.created_by = u.id')
      .leftJoin('institutions', 'i', 'i.user_id = u.id')
      .leftJoin('addresses', 'ad', 'ad.id = se.address_id')
      .where('se.start_date >= CURRENT_DATE')
      // Filter in WHERE clause using subquery instead of HAVING
      .andWhere(
        `(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(ad.latitude::numeric)) 
            * cos(radians(ad.longitude::numeric) - radians(:longitude)) 
            + sin(radians(:latitude)) * sin(radians(ad.latitude::numeric))
          )
      ) < :radiusInKm`,
        { radiusInKm },
      )
      .orderBy('se.participant_count', 'DESC')
      .addOrderBy('distance', 'ASC')
      .setParameters({ latitude, longitude })
      .limit(10)
      .getRawMany();
  }
}
