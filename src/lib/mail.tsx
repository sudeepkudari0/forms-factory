type MailMockPayload =
  | {
      type: "team-invite";
      to: string;
      inviterName: string;
      inviteeName: string;
      teamName: string;
      inviteLink: string;
    }
  | {
      type: "otp";
      to: string;
      otp: string;
    };

const logMailMock = (payload: MailMockPayload) => {
  console.info("[mail-mock]", payload);
};

export const sendInvitationEmail = async (
  email: string,
  inviterName: string,
  inviteeName: string,
  teamName: string,
  inviteLink: string
) => {
  logMailMock({
    type: "team-invite",
    to: email,
    inviterName,
    inviteeName,
    teamName,
    inviteLink,
  });
};

export const sendOtpEmail = async (otp: string, email: string) => {
  logMailMock({
    type: "otp",
    to: email,
    otp,
  });
};
