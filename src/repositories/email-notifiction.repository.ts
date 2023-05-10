import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {EmailNotification, EmailNotificationRelations} from '../models';

export class EmailNotificationRepository extends DefaultCrudRepository<
  EmailNotification,
  typeof EmailNotification.prototype.id,
  EmailNotificationRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(EmailNotification, dataSource);
  }
}
