import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {EmailNotification} from '../models';
import {EmailNotificationRepository} from '../repositories';
const sgMail = require('@sendgrid/mail')

@injectable({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor(
    @repository(EmailNotificationRepository)
    private emailNotificationRepository: EmailNotificationRepository
  ) { }

  /**
   * Se envía el email a través de AWS (SES)
   * @param data datos para el envío del email
   * @returns boolean con el resultado del envío
   */
  async SendEmailNotificationThroughAWS(data: EmailNotification): Promise<boolean> {
    return true;
  }


  /**
   * Se envía el email a través de sendgrid
   * @param data datos para el envío del email
   * @returns boolean con el resultado del envío
   */
  async SendEmailNotificationThroughSG(data: EmailNotification): Promise<boolean> {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: data.to,
      from: data.from,
      templateId: 'd-ab08e0a808c84cf5bf8c76fa69139fe2',
      dynamic_template_data: {
        subject: data.subject,
        name: data.toName,
        content: data.messageContent,
      },
    };

    return await sgMail
      .send(msg)
      .then((response: any) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
        return true;
      })
      .catch((error: any) => {
        console.error(error);
        data.responseData = error;
        data.sentError = true;
        this.emailNotificationRepository.create(data);
        throw error;
      });
  }
}
