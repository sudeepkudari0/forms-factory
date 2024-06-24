"use client";

import type { SideNavItem } from "@/types";
import { Icon } from "@iconify/react";

export const SUPER_ADMIN_ITEMS: SideNavItem[] = [
  {
    title: "Forms",
    path: "/super-admin",
    icon: <Icon icon="lucide:file-text" width="20" height="20" />,
    // submenu: true,
    // subMenuItems: [
    //   { title: "All", path: "/projects" },
    //   { title: "Web Design", path: "/projects/web-design" },
    //   { title: "Graphic Design", path: "/projects/graphic-design" },
    // ],
  },
  {
    title: "teams",
    path: "/super-admin/teams",
    icon: <Icon icon="lucide:home" width="20" height="20" />,
  },
  {
    title: "Admin",
    path: "/super-admin/admin",
    icon: <Icon icon="lucide:user-cog" width="20" height="20" />,
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
    path: "/user",
    icon: <Icon icon="lucide:folder" width="20" height="20" />,
  },
  {
    title: "Api Keys",
    path: "/api-keys",
    icon: <Icon icon="lucide:key" width="20" height="20" />,
  },
];
