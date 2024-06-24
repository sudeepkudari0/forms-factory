import Header from "@/components/layout/header"
import { getCurrentUser } from "@/lib/session"
import { UserStatus } from "@prisma/client"
import { redirect } from "next/navigation"

const UnauthorizedLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const user = await getCurrentUser()
  if (!user) {
    return redirect("/login")
  }
  if (user.status !== UserStatus.ACTIVE) {
    return redirect("/onboarding")
  }
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-[80px] w-full">
        <Header />
      </div>
      <main className="h-full pt-[80px]">{children}</main>
    </div>
  )
}

export default UnauthorizedLayout
