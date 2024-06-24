import { deleteteam } from "@/actions/team";
import type { getteams } from "@/actions/team";
import { ToolTip } from "@/components/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-column-header";
import { cn } from "@/lib/utils";
import type {} from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CircleIcon, PencilIcon, Trash2 } from "lucide-react";
import UpdateteamForm from "./_components/update-team-form";
type team = getteams;

export const columns: ColumnDef<team>[] = [
  {
    accessorKey: "published",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      const team = row.original;

      return (
        <div className="inline-flex items-center">
          <CircleIcon
            className={cn(
              "mr-2 h-2 w-2 text-transparent",
              team.published ? "fill-green-600" : "fill-yellow-600"
            )}
          />
          <span>{team.published ? "Public" : "Draft"}</span>
        </div>
      );
    },
  },
  {
    id: "forms",
    accessorKey: "forms.length",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Forms" />
    ),
    cell: ({ row }) => {
      const team = row.original;
      const formsNames = team?.forms?.map((form) => form.form.title).join(", ");
      return (
        <div className="inline-flex items-center">
          <span>{team?.forms?.length}</span>
          <ToolTip data={formsNames} />
        </div>
      );
    },
  },
  {
    id: "users",
    accessorKey: "users.length",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Users" />
    ),
    cell: ({ row }) => {
      const team = row.original;
      const usersName = team?.users?.map((user) => user.user.name).join(", ");
      return (
        <div className="inline-flex items-center">
          <span>{team?.users?.length}</span>
          <ToolTip data={usersName} />
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
      const team = row.original;

      return <div>{dayjs(team.createdAt).format("MMM D, YYYY")}</div>;
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const team = row.original;

      return (
        <div className="flex flex-row gap-4">
          <UpdateteamForm
            trigger={
              <PencilIcon className="size-3 cursor-pointer text-blue-600" />
            }
            team={team}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Trash2 className="size-3 cursor-pointer text-red-600" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are going to delete this team. It will be <b>deleted </b>
                  permanently.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={() => deleteteam({ teamId: team.id })}
                  >
                    Delete team
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
