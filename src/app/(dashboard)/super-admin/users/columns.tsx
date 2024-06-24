"use client";

import { DataTableColumnHeader } from "@/components/ui/data-column-header";
import { cn } from "@/lib/utils";
import { type User, UserStatus } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CircleIcon, PencilIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { DeleteUserDialog } from "./_components/delete-user-form";
import UpdateUserForm from "./_components/update-user-form";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Link
          href={`/super-admin/users/${user.id}`}
          className="decoration-muted-foreground truncate underline decoration-dashed underline-offset-4"
        >
          {user.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original;

      return <p className="">{user.email}</p>;
    },
  },
  {
    accessorKey: "userStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="inline-flex items-center">
          <CircleIcon
            className={cn(
              "mr-2 h-2 w-2 text-transparent",
              user.userStatus === UserStatus.ACTIVE
                ? "fill-green-600"
                : user.userStatus === UserStatus.INACTIVE
                ? "fill-red-600"
                : "fill-yellow-600"
            )}
          />
          <span>
            {user.userStatus === UserStatus.ACTIVE
              ? "ACTIVE"
              : user.userStatus === UserStatus.INACTIVE
              ? "INACTIVE"
              : "PENDING"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "whatsapp",
    header: "Whatsapp",
    cell: ({ row }) => {
      const form = row.original;

      return (
        <div>
          <Link
            href={`https://wa.me/${form.whatsapp}`}
            target="_blank"
            className="text-blue-600 font-medium hover:underline"
          >
            {form.whatsapp}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => {
      const form = row.original;

      return <div>{dayjs(form.createdAt).format("MMM D, YYYY")}</div>;
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex flex-row gap-4">
          <UpdateUserForm
            trigger={
              <PencilIcon className="size-3 cursor-pointer text-blue-600" />
            }
            user={user}
          />
          <DeleteUserDialog
            trigger={<Trash2 className="size-3 cursor-pointer text-red-600" />}
            user={user}
          />
        </div>
      );
    },
  },
];
