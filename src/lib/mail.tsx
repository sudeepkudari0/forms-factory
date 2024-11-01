import { Resend } from "resend";

const fromEmail = "admin@mail.thinkroman.com";
const replyTo = "admin@mail.thinkroman.com";

const resendClient = new Resend(process.env.RESEND_API_KEY);

// For team invitation
export const sendInvitationEmail = async (
  email: string,
  inviterName: string,
  inviteeName: string,
  teamName: string,
  inviteLink: string
) => {
  try {
    await resendClient.emails.send({
      from: fromEmail,
      reply_to: replyTo,
      to: email,
      subject: "You're Invited to Join a Team on Tr Forms Factory",
      html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #041c48;
            color: white;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 30px;
            line-height: 1.6;
        }
        .invitation-details {
            background-color: #f8f9fa;
            border-left: 3px solid #041c48;
            padding: 15px;
            margin: 20px 0;
        }
        .button {
            background-color: #007bff;
            color: #ffffff !important;
            padding: 12px 25px;
            text-align: center;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            margin: 20px 0;
            font-weight: bold;
        }
        .link-fallback {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            word-break: break-all;
            font-size: 14px;
            border: 1px solid #e2e8f0;
        }
        .footer {
            padding: 20px 30px;
            background-color: #f8f9fa;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 5px 0;
        }
        strong {
            color: #041c48;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Team Invitation</h1>
        </div>
        <div class="content">
            <p>Hello, ${inviteeName}</p>
            
            <div class="invitation-details">
                <p>You have been invited by <strong>${inviterName}</strong> to join the team <strong>${teamName}</strong> on Tr Forms Factory.</p>
            </div>
            
            <p>Please click the button below to accept the invitation and join the team:</p>
            
            <div style="text-align: center;">
                <a href="${inviteLink}" class="button">Accept Invitation</a>
            </div>
            
            <p>If you're having trouble with the button, you can copy and paste this link into your browser:</p>
            <div class="link-fallback">
                ${inviteLink}
            </div>
        </div>
        
        <div class="footer">
            <p>Best regards,</p>
            <p><strong>${inviterName}</strong></p>
            <p><strong>Tr Forms Factory</strong></p>
        </div>
    </div>
</body>
</html>`,
    });
  } catch (error) {
    console.error("Error sending invitation email:", error);
  }
};

// For user invitation
export const sendUserInvitationEmail = async (email: string, token: string) => {
  const inviteLink = `${process.env.APP_URL}/login?tab=register`;
  const logoUrl = `${process.env.APP_URL}/LOGO.svg`;
  const supportEmail = "admin@mail.thinkroman.com";
  try {
    await resendClient.emails.send({
      from: fromEmail,
      reply_to: replyTo,
      to: email,
      subject: "You're Invited to Join Tr Forms Factory",
      html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(to right, #1e3c72, #2a5298);
            padding: 20px;
            text-align: center;
        }
        .logo {
            max-width: 200px;
            margin-bottom: 10px;
        }
        .title {
            color: white;
            font-size: 24px;
            margin: 0;
            padding: 0;
        }
        .content {
            padding: 30px;
            color: #333;
            line-height: 1.6;
        }
        .token-container {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .token {
            font-family: 'Courier New', monospace;
            font-size: 24px;
            font-weight: bold;
            color: #1e3c72;
            letter-spacing: 2px;
        }
        .steps {
            margin: 20px 0;
            padding-left: 20px;
        }
        .steps li {
            margin-bottom: 10px;
        }
        .footer {
            padding: 20px 30px;
            background-color: #f8f9fa;
            color: #666;
            font-size: 14px;
        }
        .disclaimer {
            font-size: 12px;
            color: #999;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">One-time Access Code</h1>
        </div>
        <div class="content">
            
            <p>We are excited to invite you to join Tr Forms Factory, a platform dedicated to streamlining and enhancing your experience with forms and data management.</p>

            <div class="token-container">
                <p>Your Access Token:</p>
                <div class="token">${token}</div>
            </div>

            <p>To get started, please follow these steps:</p>
            <ol class="steps">
                <li>Visit our Registration Page: <a href="${inviteLink}">[Registration-URL]</a></li>
                <li>Enter the access token provided above</li>
                <li>Complete your profile information</li>
            </ol>

            <p>By joining, you agree to our Terms of Service and Privacy Policy, which you can review on our website.</p>

            <p>If you have any questions or need assistance, please don't hesitate to contact us at <a href="mailto:${supportEmail}">[Support-Email]</a>.</p>

            <p>Welcome to Tr Forms Factory! We look forward to having you on board.</p>

            <p>Best regards,<br>The Tr Forms Factory Team</p>
        </div>
        <div class="footer">
            <div class="disclaimer">
                If you didn't request this email, there's nothing to worry about — you can safely ignore it.
            </div>
        </div>
    </div>
</body>
</html>`,
    });
  } catch (error) {
    console.error("Error sending invitation email:", error);
  }
};

export const sendOtpEmail = async (otp: string, email: string) => {
  try {
    await resendClient.emails.send({
      from: fromEmail,
      to: email,
      reply_to: replyTo,
      subject: "Tr Forms Factory Verification Code",
      html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <p>Hello,</p>
            <p>Your verification code is:</p>
            <br/>
            <div style="text-align: center; margin: 20px;">
              <span style="font-size: 24px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; letter-spacing: 3px;">
                ${otp}
              </span>
            </div>
            <br/>
            <p>Please enter this code in the required field to proceed.</p>
            <p>If you did not request this code, please ignore this email or contact support if you have any questions.</p>
            <p>Best regards,</p>
            <p><strong>Tr Forms Factory</strong></p>
          </div>
        `,
    });
  } catch (error) {
    console.error("Error sending notification email:", error);
  }
};
