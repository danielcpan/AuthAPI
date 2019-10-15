const nodemailer = require('nodemailer');
// const fs = require('fs');
const { ENV, NODE_MAILER_USER, NODE_MAILER_PASS } = require('../config/config');
// const registerEmailHtml = require('../assets/register-email.html');


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
  sendRegistrationEmail: async (email) => {
    const transporter = module.exports.createTransporter();

    try {
      const info = await transporter.sendMail({
        from: `"Daniel Pan's Auth API" <${NODE_MAILER_USER}>`, 
        to: email, 
        subject: 'Verify Your Email', 
        text: 'Hello World'
        // html: registerEmailHtml
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