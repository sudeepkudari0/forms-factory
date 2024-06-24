import { UserRole, UserStatus } from "@prisma/client"
import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"

const OnboardingPage = async () => {
  const user = await getCurrentUser()
  if (!user) {
    return redirect("/login")
  }
  if (user?.status === UserStatus.ACTIVE) {
    if (user?.role === UserRole.USER) {
      return redirect("/user")
    }
    if (user?.role === UserRole.SUPER_ADMIN) {
      return redirect("/super-admin")
    }
    return redirect("/")
  }
  if (user?.status === UserStatus.INACTIVE) {
    return redirect("/unauthorized")
  }
  return redirect("/")
}
export default OnboardingPage
