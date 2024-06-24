"use client";

import {
  duplicateFormFields,
  setFormArchived,
  setFormPublished,
} from "@/actions/forms";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import type { Field, Form, Submission, Teams } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  CircleIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  MoreHorizontal,
  PencilIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";

type FormWithFields = Form & {
  fields: Field[];
  submissions: Submission[];
  teams: Teams[];
};

const setPublishForm = async ({
  formId,
  publish,
}: {
  formId: string;
  publish: boolean;
}) => {
  await setFormPublished({
    id: formId,
    published: publish,
  });
  toast({
    title: `Form ${publish ? "published" : "unpublished"}`,
    description: `Form has been ${publish ? "published" : "unpublished"}`,
  });
};

const duplicateForm = async (formId: string) => {
  const data = await duplicateFormFields(formId);

  toast({
    title: "Form duplicated",
    description: `Form has been duplicated with the title "${data?.title}"`,
  });
};

const setArchiveForm = async ({
  formId,
  archived,
}: {
  formId: string;
  archived: boolean;
}) => {
  await setFormArchived({
    id: formId,
    archived: archived,
  });
  toast({
    title: `Form ${archived ? "archived" : "unarchived"}`,
    description: `Form has been ${archived ? "archived" : "unarchived"}`,
  });
};

export const columns: ColumnDef<FormWithFields>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const form = row.original;

      return (
        <Link
          href={`/super-admin/forms/${form.id}`}
          className="decoration-muted-foreground truncate underline decoration-dashed underline-offset-4"
        >
          {form.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "published",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const form = row.original;

      return (
        <div className="inline-flex items-center">
          <CircleIcon
            className={cn(
              "mr-2 h-2 w-2 text-transparent",
              form.published ? "fill-green-600" : "fill-yellow-600"
            )}
          />
          <span>{form.published ? "Published" : "Draft"}</span>
        </div>
      );
    },
  },
  {
    id: "teams",
    accessorKey: "teams.length",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="team" />
    ),
    cell: ({ row }) => {
      const form = row.original;
      const teamName = form?.teams?.map((team) => team.name).join(", ");
      return (
        <div className="inline-flex items-center">
          <span>{teamName}</span>
        </div>
      );
    },
  },
  {
    id: "fields",
    accessorKey: "fields.length",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fields" />
    ),
    cell: ({ row }) => {
      const form = row.original;

      return <div>{form?.fields?.length}</div>;
    },
  },
  {
    id: "submissions",
    accessorKey: "submissions.length",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submissions" />
    ),
    cell: ({ row }) => {
      const form = row.original;

      return <div>{form?.submissions?.length}</div>;
    },
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created by" />
    ),
    cell: ({ row }) => {
      const form = row.original;

      return <div>{form.createdBy}</div>;
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
    cell: ({ row }) => {
      const form = row.original;

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setPublishForm({
                      formId: form.id,
                      publish: !form.published,
                    });
                  }}
                >
                  {!form.published ? (
                    <>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      <span>Publish</span>
                    </>
                  ) : (
                    <>
                      <EyeOffIcon className="mr-2 h-4 w-4" />
                      <span>Unpublish</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href={`/forms/${form.id}/edit`}>
                  <DropdownMenuItem>
                    <PencilIcon className="mr-2 h-4 w-4" />
                    <span>Edit form</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => duplicateForm(form.id)}>
                  <CopyIcon className="mr-2 h-4 w-4" />
                  <span>Duplicate form</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Archive form</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You are going to archive this form. Its <b>not</b> deleted
                permanently though. You can restore it whenever you want.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() =>
                    setArchiveForm({ archived: true, formId: form.id })
                  }
                >
                  Archive form
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
