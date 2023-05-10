import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {EmailNotifiction, EmailNotifictionRelations} from '../models';

export class EmailNotifictionRepository extends DefaultCrudRepository<
  EmailNotifiction,
  typeof EmailNotifiction.prototype.id,
  EmailNotifictionRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(EmailNotifiction, dataSource);
  }
}
