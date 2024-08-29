const nodemailer = require("nodemailer");

const mailer = async (
  htmlbody = "<b>Hello world?</b>",
  subject = "Query From DriveFood!",
  sendTo = process.env.MYAPP_MAIL_SENT_TO || [
    "hishrma02@gmail.com",
    "himanshu.sharma@gig4ce.com",
  ]
) => {
  try {
    let config = {
      service: "gmail",
      auth: {
        user: process.env.MYAPP_GMAIL_USER,
        pass: process.env.MYAPP_GMAIL_APP_PASS,
      },
    };

    let transporter = nodemailer.createTransport(config);

    let message = {
      from: process.env.MYAPP_GMAIL_USER,
      to: sendTo,
      subject: subject,
      html: htmlbody,
    };

    let info = await transporter.sendMail(message);
    return {
      msg: "Successfully submitted, we will contact you soon.",
      messageid: info.messageId,
      success: true,
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = mailer;
