import nodemailer from 'nodemailer'

export const sendEmail = async (to, sub, text, otp = null, link = null) => {
  try {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>${sub}</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  background-color: #e60459;
                  color: white;
                  padding: 20px;
                  text-align: center;
                  border-radius: 5px 5px 0 0;
              }
              .content {
                  padding: 20px;
                  background-color: #f9f9f9;
                  border-radius: 0 0 5px 5px;
                  border: 1px solid #e0e0e0;
                  border-top: none;
              }
              .footer {
                  margin-top: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #777777;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #e60459;
                  color: white !important;
                  text-decoration: none;
                  border-radius: 3px;
                  margin: 15px 0;
              }
              .logo {
                  max-width: 150px;
                  margin-bottom: 15px;
              }
              .otp-box {
                  display: inline-block;
                  background: #ffe4ec;
                  color: #e60459;
                  font-weight: bold;
                  font-size: 18px;
                  padding: 8px 15px;
                  border-radius: 5px;
                  margin: 10px 0;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>${sub}</h1>
          </div>
          <div class="content">
              <p>${text.replace(/\n/g, '<br>')}</p>

              ${
                otp 
                ? `<p>Your OTP is: <span class="otp-box">${otp}</span></p>` 
                : ""
              }

              ${
                link 
                ? `<p><a href="${link}" class="button">Change Password</a></p>` 
                : ""
              }
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>Your Team</p>
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
              <p>
                  <a href="#" style="color: #e60459;">Privacy Policy</a> | 
                  <a href="#" style="color: #e60459;">Terms of Service</a>
              </p>
          </div>
      </body>
      </html>
    `;

    const sendMail = await transporter.sendMail({
      from: "Hunkey Butler",
      to: to,
      subject: sub,
      text: text,
      html: htmlTemplate
    });

    return sendMail;
  } catch (error) {
    // console.log(error);
    return error;
  }
};





 const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "rakib.fbinternational@gmail.com",
    pass: "gbjv irau ksag logr",
  },})


















































  export const otpGenaretor = async()=>{

      const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
  }




