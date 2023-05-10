import {Entity, model, property} from '@loopback/repository';

@model()
export class EmailNotifiction extends Entity {
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
  from: string;

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
    type: 'date',
    required: true,
  })
  dateSent: string;

  @property({
    type: 'boolean',
    default: false,
  })
  sent?: boolean;


  constructor(data?: Partial<EmailNotifiction>) {
    super(data);
  }
}

export interface EmailNotifictionRelations {
  // describe navigational properties here
}

export type EmailNotifictionWithRelations = EmailNotifiction & EmailNotifictionRelations;
