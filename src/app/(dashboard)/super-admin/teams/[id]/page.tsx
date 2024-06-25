import { DashboardHeader } from "@/components/header";
import { Icons } from "@/components/icons";
import { DashboardShell } from "@/components/shell";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FormsToteam } from "./_components/form-to-team";
const getteam = async ({ id }: { id: string }) => {
  const team = await db.teams.findFirst({
    where: { id },
  });

  if (!team) {
    throw new Error("team not found");
  }

  return team;
};

const team = async ({ params: { id } }: { params: { id: string } }) => {
  const team = await getteam({ id });
  return (
    <DashboardShell>
      <div>
        <Link
          className={cn(buttonVariants({ variant: "link" }), "-ml-2")}
          href={"/super-admin/teams"}
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          All teams
        </Link>
      </div>
      <DashboardHeader heading={team.name} text="Manage your team." />
      <FormsToteam team={team} />
    </DashboardShell>
  );
};

export default team;
