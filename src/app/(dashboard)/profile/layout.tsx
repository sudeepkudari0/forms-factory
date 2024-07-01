import BreadCrumb from "@/components/breadcrumb";
import Header from "@/components/layout/header";
import HeaderMobile from "@/components/layout/header-mobile";
import MarginWidthWrapper from "@/components/layout/margin-width-wrapper";
import PageWrapper from "@/components/layout/page-wrapper";
import SideNav from "@/components/layout/sidebar";
import { SUPER_ADMIN_ITEMS, USER_ITEMS } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";
import { UserRole, UserStatus } from "@prisma/client";
import { redirect } from "next/navigation";

interface UserLayoutProps {
  children?: React.ReactNode;
}

export default async function ProfileLayout({ children }: UserLayoutProps) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return redirect("/login");
  }
  if (user?.status !== UserStatus.ACTIVE) {
    return redirect("/unauthorized");
  }

  return (
    <div className="flex">
      <SideNav
        SideNavItems={
          user.role === UserRole.USER ? USER_ITEMS : SUPER_ADMIN_ITEMS
        }
      />
      <main className="flex-1">
        <MarginWidthWrapper>
          <Header user={user} />
          <HeaderMobile
            SideNavItems={
              user.role === UserRole.USER ? USER_ITEMS : SUPER_ADMIN_ITEMS
            }
          />
          <PageWrapper>
            <BreadCrumb />
            {children}
          </PageWrapper>
        </MarginWidthWrapper>
      </main>
    </div>
  );
}
