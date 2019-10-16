/* eslint-disable no-console */
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const {
  ENV, PUBLIC_URL, NODE_MAILER_USER, NODE_MAILER_PASS,
} = require('../config/config');

module.exports = {
  createTransporter: () => nodemailer.createTransport({
    host: ENV === 'production' ? null : 'smtp.ethereal.email',
    service: ENV === 'production' ? 'gmail' : null,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: NODE_MAILER_USER,
      pass: NODE_MAILER_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  }),
  sendRegistrationEmail: async (email, emailToken) => {
    const transporter = module.exports.createTransporter();
    const html = fs.readFileSync(path.resolve(`${__dirname}../../assets/email-template.html`), 'utf8');
    const template = handlebars.compile(html);
    const replacements = {
      msg: 'Thanks for making an account for one of my portfolio apps! Click below to verify your account. Expires in 1 hour.',
      actionLink: `${PUBLIC_URL}/api/auth/verify-email/${emailToken}`,
      actionMsg: 'Verify My Email',
    };
    const htmlToSend = template(replacements);

    try {
      const info = await transporter.sendMail({
        from: `"Daniel's Auth API Service" <${NODE_MAILER_USER}>`,
        to: email,
        subject: 'Verify Your Email',
        html: htmlToSend,
      });

      if (ENV === 'development') {
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    } catch (err) {
      console.log(err);
    }
  },
  sendResetPasswordEmail: async (email, secretKey, passwordResetId) => {
    const transporter = module.exports.createTransporter();
    const html = fs.readFileSync(path.resolve(`${__dirname}../../assets/email-template.html`), 'utf8');
    const template = handlebars.compile(html);
    const replacements = {
      msg: 'You\'ve requested to reset your password. Click below to reset the password to your account. Expires in 1 hour.',
      actionLink: `${PUBLIC_URL}/api/auth/regainPassword/${secretKey}/${passwordResetId}`,
      actionMsg: 'Reset My Password',
    };
    const htmlToSend = template(replacements);

    try {
      const info = await transporter.sendMail({
        from: `"Daniel's Auth API Service" <${NODE_MAILER_USER}>`,
        to: email,
        subject: 'Reset Your Password',
        html: htmlToSend,
      });

      if (ENV === 'development') {
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    } catch (err) {
      console.log(err);
    }
  },
};
