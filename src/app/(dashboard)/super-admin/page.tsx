import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import { UserRole, UserStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import CreateFormForm from "./_components/create-form-form";
import { columns } from "./columns";

const getForms = async () => {
  try {
    const data = await db.form.findMany({
      where: {
        archived: false,
      },
      include: {
        fields: true,
        submissions: true,
        teams: {
          include: {
            team: true,
          },
        },
      },
    });

    const formattedData = data.map((form) => ({
      ...form,
      teams: form.teams ? form.teams.map((teamForm) => teamForm.team) : [],
    }));

    return formattedData;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  }
};

const SuperAdminPage = async () => {
  const user = await getCurrentUser();
  if (!user?.id) {
    return redirect("/login");
  }
  if (user?.role !== UserRole.SUPER_ADMIN) {
    return redirect("/onboarding");
  }
  if (user?.status !== UserStatus.ACTIVE) {
    return redirect("/unauthorized");
  }
  const forms = await getForms();
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Forms Library"
        text="Create and manage your forms."
      >
        <CreateFormForm
          trigger={
            <Button className="rounded text-white font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] ">
              Create Form
            </Button>
          }
          userId={user.id}
          username={user.name || ""}
        />
      </DashboardHeader>
      <div className="overflow-hidden px-2">
        {forms?.length ? (
          <DataTable columns={columns} data={forms} searchColumn="title" />
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No form created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any forms yet. Create your first one.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
};

export default SuperAdminPage;
