import { getInviteInfo } from "@/actions/team";
import { db } from "@/lib/db";
import { AcceptInviteCard } from "./_components/accept-invite-card";
import { TokenExpiredDialog } from "./_components/token-expired-dialog";

const getteam = async ({ id }: { id: string }) => {
  const team = await db.teams.findFirst({
    where: { id },
    select: { name: true },
  });

  if (!team) {
    throw new Error("team not found");
  }

  return team;
};

export default async function InvitePage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = searchParams;
  const data = await getInviteInfo(token);
  console.log(data);
  if (data === "Invalid token") {
    return (
      <div className="h-screen flex items-center justify-center">
        <TokenExpiredDialog />
      </div>
    );
  }

  const team = await getteam({ id: data.teamId });

  return (
    <div className="h-screen flex items-center justify-center">
      <AcceptInviteCard data={data} teamName={team.name} />
    </div>
  );
}
