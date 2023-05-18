// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
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


  @post('/send-email')
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
    try {
      let securityHash = process.env.SECURITY_HASH;
      if (email.securityHash == securityHash) {
        //let emailFrom = process.env.SENDGRID_SENDER;
        // enviar con el servicio
        let emailSent = false;
        switch (email.emailServiceProvider) {
          case "SG":
            emailSent = await this.notificationService.SendEmailNotificationThroughSG(email);
            break;

          case "AWS":
            emailSent = await this.notificationService.SendEmailNotificationThroughAWS(email);
            break;
          default:
            console.log("-----------------------------------------------");
            console.log("Mensaje no enviado para: ");
            console.log(email);
            console.log("-----------------------------------------------");
        }
        // agregar fecha y estado
        email.dateSent = `${new Date()}`;
        email.sent = emailSent;
        email.sentError = false;
        email.responseData = "OK";
        // guardar en BD
        return this.emailNotificationRepository.create(email);
      } else {
        throw new HttpErrors[401]("Email sender not available.");
      }
    } catch (err: any) {
      console.log(err);
      throw new HttpErrors[500]("Email error sending to " + email.to);
    }
  }


}
