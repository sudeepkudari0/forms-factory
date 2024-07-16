"use client";

import { InviteUserForm } from "@/app/(dashboard)/super-admin/_components/invite-user-dialog";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import type { User } from "next-auth";
import { useSelectedLayoutSegment } from "next/navigation";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { UserAccountNav } from "../user-account-nav";
import { UserNav } from "../user-nav";

const Header = ({ user }: { user?: User }) => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
      className={cn(
        "sticky inset-x-0 top-0 z-30 w-full border-b transition-all",
        {
          "border-b backdrop-blur-lg": scrolled,
          "border-b   backdrop-blur-lg": scrolled,
          "border-b ": selectedLayout,
        }
      )}
    >
      <div className="flex h-[50px] md:h-[79px] items-center justify-end px-4">
        <div className="mr-4 hidden space-x-2 md:flex md:items-center md:justify-center">
          <InviteUserForm
            trigger={
              <Button className="rounded text-white text-[15px] bg-gradient-to-r from-[#0077B6] to-[#00BCD4] ">
                Invite
              </Button>
            }
          />
          <ModeToggle />
          {user ? <UserAccountNav userData={user} /> : <UserNav />}
        </div>
      </div>
    </div>
  );
};

export default Header;
