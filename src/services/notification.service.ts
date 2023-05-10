import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {EmailNotification} from '../models';
const sgMail = require('@sendgrid/mail')

@injectable({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */

  SendEmailNotification(data: EmailNotification) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: 'recipient@example.org',
      from: 'sender@example.org',
      subject: 'Hello world',
      text: 'Hello plain world!',
      html: '<p>Hello HTML world!</p>',
      templateId: 'd-f43daeeaef504760851f727007e0b5d0',
      dynamic_template_data: {
        subject: 'Testing Templates & Stuff',
        name: 'Some "Testing" One',
        city: '<b>Denver<b>',
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

    sgMail
      .send(msg)
      .then((response: any) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
      })
      .catch((error: any) => {
        console.error(error)
      })
  }
}
