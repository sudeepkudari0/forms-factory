"use client";

import { Icons } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const HeaderHelper = () => {
  return (
    <div>
      <Link
        href="/onboarding"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-2 top-2 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>{" "}
      <div className="absolute top-2 right-2 md:right-8 md:top-8">
        <ModeToggle />
      </div>
    </div>
  );
};
