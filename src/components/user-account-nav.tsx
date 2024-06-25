import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { env } from "@/env.mjs";
import { UserRole } from "@prisma/client";
import Cookies from "js-cookie";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
export function UserAccountNav({ userData }: { userData: User }) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar
            user={{
              name: userData.name || null,
              image: userData.image || null,
            }}
            className="h-10 w-10"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {userData.name && <p className="font-medium">{userData.name}</p>}
              {userData.email && (
                <p className="text-muted-foreground w-[200px] truncate text-sm">
                  {userData.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <Link
            href={
              userData.role === UserRole.USER
                ? "/user/profile"
                : "/super-admin/profile"
            }
          >
            <DropdownMenuItem className="cursor-pointer w-full">
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault();
              Cookies.remove("tid");
              Cookies.remove("tname");
              signOut({
                callbackUrl: `${env.NEXT_PUBLIC_APP_URL}/login`,
              });
            }}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
