"use client";

import type { SideNavItem } from "@/types";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";

export const SUPER_ADMIN_ITEMS: SideNavItem[] = [
  {
    title: "Forms",
    path: "/super-admin",
    icon: <Icon icon="lucide:file-text" width="20" height="20" />,
  },
  {
    title: "teams",
    path: "/super-admin/teams",
    icon: <Icon icon="lucide:home" width="20" height="20" />,
  },
  {
    title: "Users",
    path: "/super-admin/users",
    icon: <Icon icon="lucide:users" width="20" height="20" />,
  },
];

export const USER_ITEMS: SideNavItem[] = [
  {
    title: "Forms",
    path: `/${Cookies.get("tname")}`,
    icon: <Icon icon="lucide:folder" width="20" height="20" />,
  },
  {
    title: "Api Keys",
    path: "/api-keys",
    icon: <Icon icon="lucide:key" width="20" height="20" />,
  },
];
