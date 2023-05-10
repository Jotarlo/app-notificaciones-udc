import {Entity, model, property} from '@loopback/repository';

@model()
export class SmsNotification extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  to: string;

  @property({
    type: 'string',
    required: true,
  })
  messageContent: string;

  @property({
    type: 'date',
    required: true,
  })
  dateSent: string;

  @property({
    type: 'boolean',
    default: false,
  })
  sent?: boolean;


  constructor(data?: Partial<SmsNotification>) {
    super(data);
  }
}

export interface SmsNotificationRelations {
  // describe navigational properties here
}

export type SmsNotificationWithRelations = SmsNotification & SmsNotificationRelations;
