import {Entity, model, property} from '@loopback/repository';

@model()
export class EmailNotification extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: false,
  })
  from?: string;

  @property({
    type: 'string',
    required: true,
  })
  to: string;

  @property({
    type: 'string',
    required: true,
  })
  toName: string;

  @property({
    type: 'string',
    required: true,
  })
  subject: string;

  @property({
    type: 'string',
    required: true,
  })
  messageContent: string;

  @property({
    type: 'string',
    required: false,
  })
  dateSent?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  sent?: boolean;

  @property({
    type: 'string',
    required: true,
  })
  securityHash?: string;


  constructor(data?: Partial<EmailNotification>) {
    super(data);
  }
}

export interface EmailNotificationRelations {
  // describe navigational properties here
}

export type EmailNotificationWithRelations = EmailNotification & EmailNotificationRelations;
