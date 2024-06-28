import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { UserRole, UserStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { columns } from "./_components/columns";
import { CreateWebhookButton } from "./_components/create-webhook-button";

const getWebhooks = async (id: string) => {
  const res = await db.webhook.findMany({
    where: {
      userId: id,
      deleted: false,
    },
  });

  return res;
};

const WebhooksPage = async () => {
  const user = await getCurrentUser();
  const webhooks = await getWebhooks(user?.id as string);

  if (!user?.id) {
    return redirect("/login");
  }
  if (user?.role !== UserRole.USER) {
    return redirect("/onboarding");
  }
  if (user?.status !== UserStatus.ACTIVE) {
    return redirect("/unauthorized");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Webhooks"
        text="Create webhooks to connect with other applications and keep track of your submissions."
      >
        <CreateWebhookButton userId={user?.id} />
      </DashboardHeader>
      <div className="overflow-hidden px-2">
        {webhooks?.length ? (
          <DataTable columns={columns} data={webhooks} />
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="webhook" />
            <EmptyPlaceholder.Title>No webhook created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any webhooks yet. Create your first one.
            </EmptyPlaceholder.Description>
            <CreateWebhookButton userId={user?.id} />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
};

export default WebhooksPage;
