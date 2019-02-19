const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'apikey', // account.user, // generated ethereal user
    pass: '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', // account.pass, // generated ethereal password
  },
});
// async..await is not allowed in global scope, must use a wrapper
class Email {
  static async sendEmail(from, to, subject, text = null, html = null) {
    let result = null;
    // setup email data with unicode symbols
    let mailOptions = {
      from: from, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    if (info) {
      result = {
        messageId: info.messageId,
        messageUrl: nodemailer.getTestMessageUrl(info),
      };
    } else {
      result = {
        messageId: '',
        messageUrl: '',
      };
    }

    return result;
  }
}

module.exports = Email;
