import { redirect } from "next/navigation";

import BreadCrumb from "@/components/breadcrumb";
import Header from "@/components/layout/header";
import HeaderMobile from "@/components/layout/header-mobile";
import MarginWidthWrapper from "@/components/layout/margin-width-wrapper";
import PageWrapper from "@/components/layout/page-wrapper";
import SideNav from "@/components/layout/sidebar";
import { SUPER_ADMIN_ITEMS } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";
import { UserRole, UserStatus } from "@prisma/client";

interface SuperAdminLayoutProps {
  children?: React.ReactNode;
}

export default async function SuperAdminLayout({
  children,
}: SuperAdminLayoutProps) {
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
  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex">
      <SideNav SideNavItems={SUPER_ADMIN_ITEMS} />
      <main className="flex-1">
        <MarginWidthWrapper>
          <Header />
          <HeaderMobile SideNavItems={SUPER_ADMIN_ITEMS} />
          <PageWrapper>
            <BreadCrumb />
            {children}
          </PageWrapper>
        </MarginWidthWrapper>
      </main>
    </div>
  );
}
