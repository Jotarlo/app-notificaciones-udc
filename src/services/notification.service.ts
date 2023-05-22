import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AwsSesTemplateConfiguration} from '../config/aws-ses-template';
import {EmailNotification} from '../models';
import {EmailNotificationRepository} from '../repositories';
const sgMail = require('@sendgrid/mail')
const AWS = require('aws-sdk');

@injectable({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor(
    @repository(EmailNotificationRepository)
    private emailNotificationRepository: EmailNotificationRepository
  ) { }


  /**
   * Create a aws ses template
   */
  CreateSesAwsTemplate(): boolean {
    try {
      AWS.config.update({
        accessKeyId: process.env.AWS_SES_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SES_SECRET_KEY,
        region: 'us-east-1'
      });

      // Create createTemplate params
      var params = {
        Template: {
          TemplateName: AwsSesTemplateConfiguration.TemplateName,
          HtmlPart: AwsSesTemplateConfiguration.SesTemplateCode,
          SubjectPart: '{{subject}}',
          TextPart: '{{content}}',
        },
      };

      // Create the promise and SES service object
      var templatePromise = new AWS.SES({apiVersion: '2010-12-01'})
        .createTemplate(params)
        .promise();

      // Handle promise's fulfilled/rejected states
      templatePromise
        .then(function (data: any) {
          console.log(data);
        })
        .catch(function (err: any) {
          console.error(err, err.stack);
        });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /**
   * Se envía el email a través de AWS (SES)
   * @param data datos para el envío del email
   * @returns boolean con el resultado del envío
   */
  SendEmailNotificationThroughAWS(data: EmailNotification, attempNumber: number): boolean {
    try {
      AWS.config.update({
        accessKeyId: process.env.AWS_SES_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SES_SECRET_KEY,
        region: 'us-east-1'
      });

      const ses = new AWS.SES();

      const params = {
        Source: `${data.fromName} <${data.from}>`,
        Template: AwsSesTemplateConfiguration.TemplateName,
        ConfigurationSetName: AwsSesTemplateConfiguration.ConfigSetName,
        Destination: {
          ToAddresses: [data.to]
        },
        TemplateData: `{ \"subject\":\"${data.subject}\", \"name\": \"${data.toName}\", \"content\":\"${data.messageContent}\" }`
      }

      ses.sendTemplatedEmail(params, (err: any, data: any) => {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
      });
      return true;
    } catch (err) {
      console.error(err);
      data.responseData = err;
      data.sentError = true;
      this.emailNotificationRepository.create(data);
      if (attempNumber == 1) {
        this.SendEmailNotificationThroughSG(data, 2);
      }
      throw err;
    }
  }


  /**
   * Se envía el email a través de sendgrid
   * @param data datos para el envío del email
   * @returns boolean con el resultado del envío
   */
  async SendEmailNotificationThroughSG(data: EmailNotification, attempNumber: number): Promise<boolean> {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: data.to,
      from: {
        email: data.from,
        name: data.fromName
      },
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
        if (attempNumber == 1) {
          this.SendEmailNotificationThroughAWS(data, 2);
        }
        throw error;
      });
  }
}
