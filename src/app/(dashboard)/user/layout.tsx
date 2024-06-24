import { redirect } from "next/navigation";

import { getUserTeams } from "@/actions/team";
import BreadCrumb from "@/components/breadcrumb";
import Header from "@/components/layout/header";
import HeaderMobile from "@/components/layout/header-mobile";
import MarginWidthWrapper from "@/components/layout/margin-width-wrapper";
import PageWrapper from "@/components/layout/page-wrapper";
import SideNav from "@/components/layout/sidebar";
import { USER_ITEMS } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";
import { UserRole, UserStatus } from "@prisma/client";

interface UserLayoutProps {
  children?: React.ReactNode;
}

export default async function UserLayout({ children }: UserLayoutProps) {
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

  const teams = await getUserTeams(user.id);

  return (
    <div className="flex">
      <SideNav SideNavItems={USER_ITEMS} />
      <main className="flex-1">
        <MarginWidthWrapper>
          <Header />
          <HeaderMobile SideNavItems={USER_ITEMS} />
          <PageWrapper>
            <BreadCrumb />
            {children}
          </PageWrapper>
        </MarginWidthWrapper>
      </main>
    </div>
  );
}
