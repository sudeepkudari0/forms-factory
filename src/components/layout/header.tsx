"use client";
import {} from "@/components/ui/command";
import {} from "@/components/ui/popover";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import {} from "lucide-react";
import type { User } from "next-auth";
import { useSelectedLayoutSegment } from "next/navigation";
import { ModeToggle } from "../mode-toggle";
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
        <div className="mr-4 hidden space-x-2 md:flex md:items-end md:justify-end">
          <ModeToggle />
          {user ? <UserAccountNav userData={user} /> : <UserNav />}
        </div>
      </div>
    </div>
  );
};

export default Header;
