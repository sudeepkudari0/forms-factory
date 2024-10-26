import {} from "@/actions/forms";
import { DashboardHeader } from "@/components/header";
import NotFound from "@/components/layout/not-found";
import { DashboardShell } from "@/components/shell";
import { getCurrentUser } from "@/lib/session";
import { UserRole, UserStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FormsTableWithFilter from "./_components/forms-table-with-filter";

const UserPage = async ({
  params: { teamName },
}: {
  params: { teamName: string };
}) => {
  const user = await getCurrentUser();
  if (!user?.id) {
    return redirect("/login");
  }
  if (user?.role !== UserRole.USER) {
    return redirect("/onboarding");
  }
  if (user?.status !== UserStatus.ACTIVE) {
    return redirect("/unauthorized");
  }
  const cookieStore = cookies();
  const tname = cookieStore.get("tname");

  if (tname?.value !== teamName) {
    return <NotFound />;
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="My Workspace" />
      <div className="overflow-hidden px-2">
        <FormsTableWithFilter user={user} tname={tname?.value} />
      </div>
    </DashboardShell>
  );
};

export default UserPage;
