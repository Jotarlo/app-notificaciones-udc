import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {EmailNotification} from '../models';
const sgMail = require('@sendgrid/mail')

@injectable({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */

  async SendEmailNotification(data: EmailNotification): Promise<boolean> {
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

    /**

    <html>
    <head>
        <title></title>
    </head>
    <body>
    Hello {{ name }},
    <br /><br/>
    I'm glad you are trying out the template feature!
    <br /><br/>
    I hope you are having a great day in {{ city }} :)
    <br /><br/>
    </body>
    </html>

     *
     */

    return await sgMail
      .send(msg)
      .then((response: any) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
        return true;
      })
      .catch((error: any) => {
        console.error(error);
        return false;
      });
  }
}
