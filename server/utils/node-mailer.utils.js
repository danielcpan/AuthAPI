const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { ENV, PUBLIC_URL, NODE_MAILER_USER, NODE_MAILER_PASS } = require('../config/config');
const handlebars = require('handlebars');

module.exports = {
  createTransporter: () => {
    return nodemailer.createTransport({
      host: ENV === 'production' ? null : 'smtp.ethereal.email',
      service: ENV === 'production' ? 'gmail' : null,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: NODE_MAILER_USER, 
        pass: NODE_MAILER_PASS
      },
      tls:{
        rejectUnauthorized: false
      }      
    })
  },
  sendRegistrationEmail: async (email, emailToken) => {
    const transporter = module.exports.createTransporter();
    const html = fs.readFileSync(path.resolve(__dirname + '../../assets/register-email.html'), 'utf8')
    const template = handlebars.compile(html);
    const replacements = {
      msg: `Thanks for making an account for one of my portfolio apps! Click below to verify your account`,
      actionLink: `${PUBLIC_URL}/api/auth/verify-email/${emailToken}`,
      actionMsg: 'Verify My Email'
    }
    const htmlToSend = template(replacements)

    try {
      const info = await transporter.sendMail({
        from: `"Daniel's Auth API Service" <${NODE_MAILER_USER}>`, 
        to: email, 
        subject: 'Verify Your Email', 
        html: htmlToSend
      })

      if (ENV === 'development') {
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));      
      }      
    } catch (err) {
      return console.log(err)
    }
  }
}

// const readHTMLFile = function(path, callback) {
//   fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
//       if (err) {
//           throw err;
//           callback(err);
//       }
//       else {
//           callback(null, html);
//       }
//   });
// };