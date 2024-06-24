import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import CreateUserForm from "./_components/create-user-form";
import TeamsSelect from "./_components/facility-select";

const getAllteams = async () => {
  return await db.teams.findMany();
};

const UserPage = async () => {
  const user = await getCurrentUser();
  const teams = await getAllteams();

  return (
    <DashboardShell className="py-3">
      <DashboardHeader heading={user?.name} text="Explore users.">
        <CreateUserForm
          trigger={
            <Button className="rounded text-white font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] ">
              Create User / User-plus
            </Button>
          }
        />
      </DashboardHeader>
      <TeamsSelect teams={teams} />
    </DashboardShell>
  );
};

export default UserPage;
