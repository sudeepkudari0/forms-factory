import { getApiKeys } from "@/actions/api-key";
import {} from "@/actions/forms";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getCurrentUser } from "@/lib/session";
import { UserRole, UserStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import CreateApiKeyForm from "./_components/create-apikey-form";
import { columns } from "./columns";

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

  const keys = await getApiKeys(user.id);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Api Keys"
        text="create and manage your api keys."
      >
        <CreateApiKeyForm
          trigger={
            <Button className="rounded text-white font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] ">
              Create Api Key
            </Button>
          }
          user={user}
        />
      </DashboardHeader>
      <div className="overflow-hidden px-2">
        {keys?.length ? (
          <DataTable columns={columns} data={keys} searchColumn="name" />
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="user_cog" />
            <EmptyPlaceholder.Title>No keys created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any api key yet. Create your first one.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
};

export default UserPage;
