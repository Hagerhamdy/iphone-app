const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    //1- create transporter (service that will send email like gmail, mailtrap, mailgun, sendGrid)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT, // if secure false port : 587, if true port: 465
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    //2- define email options (like from, to , subject, email content)
    const mailOps = {
        from: 'E- iPhone <hagerhamdee224@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message 
    }
 
    //3- send email
    await transporter.sendMail(mailOps);
}

module.exports = sendEmail;