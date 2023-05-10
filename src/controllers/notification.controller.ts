// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {EmailNotification} from '../models';
import {EmailNotificationRepository} from '../repositories';
import {NotificationService} from '../services';

// import {inject} from '@loopback/core';


export class NotificationController {
  constructor(
    @service(NotificationService)
    private notificationService: NotificationService,
    @repository(EmailNotificationRepository)
    private emailNotificationRepository: EmailNotificationRepository
  ) { }


  @post('/cliente')
  @response(200, {
    description: 'Email notification',
    content: {'application/json': {schema: getModelSchemaRef(EmailNotification)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EmailNotification, {
            title: 'New Email',
            exclude: ['id'],
          }),
        },
      },
    })
    email: Omit<EmailNotification, 'id'>,
  ): Promise<EmailNotification> {
    // try y catch

    // agregar fecha y estado

    // enviar con el servicio

    // guardar en BD
    return this.emailNotificationRepository.create(email);
  }


}
