"use client";

import {
  duplicateFormFields,
  setFormArchived,
  setFormPublished,
  updateFormPrivacy,
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
import {
  type Form,
  FormStatus,
  type Submission,
  type Teams,
} from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { SetStateAction } from "jotai";
import {
  CircleIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MoreHorizontal,
  PencilIcon,
  Trash2,
  UnlockIcon,
} from "lucide-react";
import Link from "next/link";

interface FormWithTeams extends Form {
  facilities: Teams[];
  submissions: Submission[];
  submissionId?: string | null;
  uId: string;
  fid: string;
  tname?: string;
}

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

const duplicateForm = async (
  formId: string,
  teamId: string,
  setRefetch: React.Dispatch<SetStateAction<boolean>>
) => {
  const data = await duplicateFormFields(formId, teamId);
  if (data.success) {
    setRefetch((prev) => !prev);
    toast({
      title: "Form duplicated",
      description: `${data.message}`,
    });
  }
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

const setFormPrivacy = async ({
  formId,
  isPublic,
}: {
  formId: string;
  isPublic: boolean;
}) => {
  await updateFormPrivacy({
    formId: formId,
    isPublic: isPublic ? FormStatus.PUBLIC : FormStatus.PRIVATE,
  });
  toast({
    title: `Form set to ${isPublic ? "public" : "private"}`,
    description: `Form has been set to ${isPublic ? "public" : "private"}`,
  });
};

export const columns = (
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>
): ColumnDef<FormWithTeams>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const form = row.original;

      return (
        <Link
          href={`/${form.tname}/${form.id}?fid=${form.fid}`}
          className="decoration-muted-foreground truncate underline decoration-dashed underline-offset-4"
        >
          <div className="truncate max-w-[200px]">{form.title}</div>
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Privacy" />
    ),
    cell: ({ row }) => {
      const form = row.original;

      return (
        <div className="inline-flex items-center">
          <CircleIcon
            className={cn(
              "mr-2 h-2 w-2 text-transparent",
              form.status === FormStatus.PUBLIC
                ? "fill-green-600"
                : "fill-red-600"
            )}
          />
          <span>
            {form.status === FormStatus.PUBLIC ? "Public" : "Private"}
          </span>
        </div>
      );
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
                <DropdownMenuItem
                  onClick={() => duplicateForm(form.id, form.fid, setRefetch)}
                >
                  <CopyIcon className="mr-2 h-4 w-4" />
                  <span>Duplicate form</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setFormPrivacy({
                      formId: form.id,
                      isPublic: form.status !== FormStatus.PUBLIC,
                    });
                  }}
                >
                  {form.status !== FormStatus.PUBLIC ? (
                    <>
                      <UnlockIcon className="mr-2 h-4 w-4" />
                      <span>Make Public</span>
                    </>
                  ) : (
                    <>
                      <LockIcon className="mr-2 h-4 w-4" />
                      <span>Make Private</span>
                    </>
                  )}
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
