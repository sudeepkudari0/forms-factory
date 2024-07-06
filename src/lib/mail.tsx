import { Resend } from "resend";

const fromEmail = "admin@mail.thinkroman.com";
const replyTo = "admin@mail.thinkroman.com";

const resendClient = new Resend(process.env.RESEND_API_KEY);
export const sendInvitationEmail = async (
  email: string,
  inviterName: string,
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
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #fff;
            width: 80%;
            margin: auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #041c48;
            color: white;
            padding: 10px;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .content {
            padding-top: 10px;
            padding-left: 20px;
            padding-right: 20px;
            padding-bottom: 5px;
            line-height: 1.6;
        }
        .button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Team Invitation</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You have been invited by <strong>${inviterName}</strong> to join the team <strong>${teamName}</strong> on Tr Forms Factory.</p>
            <p>Please click the button below to accept the invitation and join the team:</p>
            <a href="${inviteLink}" class="button">Accept Invitation</a>
            <p>If the button above does not work, you can copy and paste the following link into your browser:</p>
            <p>${inviteLink}</p>
        </div>
        <div style="text-align: left; padding-top: 5px; padding-left: 20px; padding-right: 20px; color: #041c48;">
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
