import { UserRole, UserStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { cookies } from "next/headers";

const OnboardingPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/login");
  }

  const cookieStore = cookies();
  const tid = cookieStore.get("tid");
  const tname = cookieStore.get("tname");

  if (!tid) {
    return redirect("/api/tid");
  }

  if (user?.status === UserStatus.ACTIVE) {
    if (user?.role === UserRole.USER) {
      return redirect(`/${tname?.value}`);
    }
    if (user?.role === UserRole.SUPER_ADMIN) {
      return redirect("/super-admin");
    }
    return redirect("/");
  }

  if (user?.status === UserStatus.INACTIVE) {
    return redirect("/unauthorized");
  }

  return redirect("/");
};

export default OnboardingPage;
