import { SubEvent } from './entities/subEvent.entity';
import { CustomRepository } from '@/modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';
import { Address } from '@/address/entities/address.entity';
import { Event } from '@/event/entities/event.entity';
import { User } from '@/user/entities/user.entity';
import { Institution } from '@/institution/entities/institution.entity';

@CustomRepository(SubEvent)
export class SubEventRepository extends Repository<SubEvent> {
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
        'se.banner as banner',
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
        'se.banner AS banner',
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
