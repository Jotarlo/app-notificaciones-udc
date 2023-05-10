import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {SmsNotification, SmsNotificationRelations} from '../models';

export class SmsNotificationRepository extends DefaultCrudRepository<
  SmsNotification,
  typeof SmsNotification.prototype.id,
  SmsNotificationRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(SmsNotification, dataSource);
  }
}
