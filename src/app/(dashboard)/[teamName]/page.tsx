import {} from "@/actions/forms";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { getCurrentUser } from "@/lib/session";
import { UserRole, UserStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FormsTableWithFilter from "./_components/forms-table-with-filter";

const UserPage = async () => {
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

  return (
    <DashboardShell>
      <DashboardHeader heading="My Workspace" text="Fill and submit forms." />
      <div className="overflow-hidden px-2">
        <FormsTableWithFilter user={user} tname={tname?.value} />
      </div>
    </DashboardShell>
  );
};

export default UserPage;
