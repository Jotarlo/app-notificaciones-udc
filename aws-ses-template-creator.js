// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'REGION'});

// Create createTemplate params
var params = {
  Template: {
    TemplateName: 'TEMPLATE_NAME' /* required */,
    HtmlPart: 'HTML_CONTENT',
    SubjectPart: 'SUBJECT_LINE',
    TextPart: 'TEXT_CONTENT',
  },
};

// Create the promise and SES service object
var templatePromise = new AWS.SES({apiVersion: '2010-12-01'})
  .createTemplate(params)
  .promise();

// Handle promise's fulfilled/rejected states
templatePromise
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) {
    console.error(err, err.stack);
  });
