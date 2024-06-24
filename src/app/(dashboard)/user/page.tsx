import { getFormsAndteams, getSharedSubmissions } from "@/actions/forms"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { getCurrentUser } from "@/lib/session"
import { UserRole, UserStatus } from "@prisma/client"
import { redirect } from "next/navigation"
import FormsTableWithFilter from "./_components/forms-table-with-filter"

const UserPage = async () => {
  const user = await getCurrentUser()
  if (!user?.id) {
    return redirect("/login")
  }
  if (user?.role !== UserRole.USER) {
    return redirect("/onboarding")
  }
  if (user?.status !== UserStatus.ACTIVE) {
    return redirect("/unauthorized")
  }

  const { forms, teams } = await getFormsAndteams()
  const sharedSubmissions = await getSharedSubmissions()
  console.log(forms)
  return (
    <DashboardShell>
      <DashboardHeader heading="My Workspace" text="Fill and submit forms." />
      <div className="overflow-hidden px-2">
        <FormsTableWithFilter
          forms={forms}
          teams={teams}
          user={user}
          sharedSubmissions={sharedSubmissions}
        />
      </div>
    </DashboardShell>
  )
}

export default UserPage
