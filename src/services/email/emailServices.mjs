import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});


export const sendEmail = async ({ to, subject, html }) => {
    const data = {
      from: `HamroPasal <no-reply@${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    };
    try {
      await transporter.sendMail(data)
      return msg;
    } catch (error) {
      throw new Error(error);
    }
  };


export const generateToken = (email) =>
jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
  expiresIn: '1d',
});

const getVerificationLink = (token) =>
`http://dashboard.gharpaluwa.com/verify-email?token=${token}`;
export const sendVerificationEmail = async (email, token) => {
try {
  const data = {
    from: `HamroPasal <no-reply@${process.env.MAILGUN_DOMAIN}>`,
    to: [email],
    subject: 'Email Verification',
    //   html: `<h3>Click the following link to verify your email: <a href=
    // "${getVerificationLink(token)}">Verify Email</a></h3> `,
    html: `
 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
 
  <style>
      /* Inline CSS for better email client compatibility */
      body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
      }
      .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h1 {
          color: #333;
      }
      p {
          font-size: 16px;
          line-height: 1.6;
          color: #666;
      }
      .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007BFF;
          color: white !important;
          border-radius: 5px;
          text-decoration: none;
          margin-top: 20px;
          font-weight: bold;
      }
      a.button:hover {
          background-color: #0056b3;
      }
  </style>
</head>
<body>
  <div class="container">
      <h1>Email Confirmation</h1>
      <p>Welcome to our Hamropasal! We're excited to have you on board.</p>
      <p>Please click the button below to confirm your email address:</p>
      <a class="button" href="${getVerificationLink(
        token
      )}">Confirm Your Email</a>
  </div>
</body>
</html>

  `,
  };
  const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
  return msg;
} catch (error) {
  throw new Error(error);
}
};