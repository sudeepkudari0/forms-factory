import Link from "next/link";

import {} from "@/actions/users";
import { DashboardHeader } from "@/components/header";
import { Icons } from "@/components/icons";
import { DashboardShell } from "@/components/shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { FormNav } from "../_components/form-nav";
import FacilityFormsToUser from "../_components/user-to-facility";
import { AddteamToUserDialog } from "./_components/add-team-to-user-dialog";

const getUser = async ({ id }: { id: string }) => {
  const user = await db.user.findFirst({
    where: { id },
  });

  if (!user) {
    throw new Error("user not found");
  }

  return user;
};

const UserManage = async ({ params: { id } }: { params: { id: string } }) => {
  const user = await getUser({ id });
  return (
    <DashboardShell>
      <div>
        <Link
          className={cn(buttonVariants({ variant: "link" }), "-ml-2")}
          href={"/super-admin/users"}
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          All users
        </Link>
      </div>
      <DashboardHeader heading={user.name} text="Manage user.">
        <div className="flex w-full flex-col justify-end gap-2 md:w-fit md:flex-row">
          <AddteamToUserDialog
            trigger={
              <Button
                size="sm"
                className="rounded text-white font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] "
              >
                <span>Manage teams</span>
              </Button>
            }
            user={user}
          />
        </div>
      </DashboardHeader>
      <FormNav userId={id} />
      <FacilityFormsToUser userId={user.id} />
    </DashboardShell>
  );
};

export default UserManage;
