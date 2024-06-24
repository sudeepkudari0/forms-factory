import Link from "next/link"

import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"
import { buttonVariants } from "@/components/ui/button"
import { db } from "@/lib/db"
import { cn } from "@/lib/utils"

import { FormNav } from "./_components/form-nav"
import { SubmissionsTable } from "./_components/submissions-table"

const getUser = async ({ id }: { id: string }) => {
  const form = await db.user.findFirst({
    where: { id },
  })

  if (!form) {
    throw new Error("Form not found")
  }

  return form
}

const UserPage = async ({ params: { id } }: { params: { id: string } }) => {
  const user = await getUser({ id })

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
      <DashboardHeader heading={user.name} text="Explore submissions." />
      <FormNav userId={id} />
      <SubmissionsTable userId={user.id} />
    </DashboardShell>
  )
}

export default UserPage
