"use client";

import { DataTableColumnHeader } from "@/components/ui/data-column-header";
import type { ApiKey } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Trash2 } from "lucide-react";
import { DeleteApiKeyDialog } from "./_components/delete-api-key";
// import { DeleteUserDialog } from "./_components/delete-user-form"
// import UpdateAdminForm from "./_components/update-admin-form"

export const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const key = row.original;

      return <p>{key.name}</p>;
    },
  },
  {
    accessorKey: "prefix",
    header: "API Key",
    cell: ({ row }) => {
      const key = row.original;

      return <p className="">{key.prefix}*********</p>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => {
      const key = row.original;
      return <div>{dayjs(key.createdAt).format("MMM D, YYYY")}</div>;
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const apikey = row.original;

      return (
        <div className="flex flex-row gap-4">
          <DeleteApiKeyDialog
            trigger={
              <Trash2 size={18} className=" cursor-pointer text-red-600" />
            }
            apiKey={apikey}
          />
        </div>
      );
    },
  },
];
