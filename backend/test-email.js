import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'booking@hunkybutlerservice.co.uk',
    pass: 'g~lbRZf3X$',
  },
  logger: true,
  debug: true, // include SMTP traffic in the logs
});

async function main() {
  try {
    const info = await transporter.sendMail({
      from: 'booking@hunkybutlerservice.co.uk', // sender address
      to: 'booking@hunkybutlerservice.co.uk, sd.rakib36@gmail.com', // list of receivers
      subject: 'Test Email from Node.js (Debug)', // Subject line
      text: 'Hello world! This is a plain text test to see if emails are actually delivered.', // plain text body
    });

    console.log('Message sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
}

main();
