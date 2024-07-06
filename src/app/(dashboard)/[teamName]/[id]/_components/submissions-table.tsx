"use client";

import { DataTable } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {} from "@/components/ui/tooltip";
import { cn, dateFormatter } from "@/lib/utils";
import {
  type Submission,
  type SubmissionAccess,
  SubmissionStatus,
} from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { CircleIcon, EyeIcon } from "lucide-react";
import Link from "next/link";

export type SubmissionWithFormAccess = Submission & {
  submissionAccesses: SubmissionAccess[];
};

export const SubmissionsTable = ({
  submissions,
}: {
  submissions: Submission[];
}) => {
  const columns = () => {
    const allKeys = submissions
      ?.reduce<string[]>((keys, submission) => {
        const submissionKeys = Object.getOwnPropertyNames(
          JSON.parse(submission.data as string)
        );
        return keys.concat(submissionKeys);
      }, [])
      .filter((key) => key !== "fileName");
    const uniqueKeys = [...new Set(allKeys)];

    const dynamicColumns: ColumnDef<Submission>[] = uniqueKeys.map((key) => ({
      header: key,
      accessorFn: (row: any) => {
        const data = JSON.parse(row.data);
        return data[key];
      },
      cell: ({ cell }) => {
        const value: any = cell.getValue();

        if (typeof value === "object" && value !== null) {
          // Handle arrays of objects
          if (Array.isArray(value)) {
            return (
              <>
                {value.map((item, index) => (
                  <p key={index}>{item.value}</p>
                ))}
              </>
            );
          }
          if (value?.value) {
            // Handle single object with `value` property
            return <p>{value.value}</p>;
          }
        }

        if (typeof value === "string" && value.startsWith("https")) {
          return (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <Link
                    href={value}
                    target="_blank"
                    className="font-bold text-blue-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <TooltipContent>
                    <p>{value}</p>
                  </TooltipContent>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return <p>{value}</p>;
      },
    }));

    const staticColumns: ColumnDef<Submission>[] = [
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const submission = row.original;
          return (
            <div className="inline-flex items-center">
              <CircleIcon
                className={cn(
                  "mr-2 h-2 w-2 text-transparent",
                  submission.status === SubmissionStatus.SUBMITTED
                    ? "fill-green-600"
                    : "fill-yellow-600"
                )}
              />
              <span>
                {submission.status === SubmissionStatus.SUBMITTED
                  ? "Submitted"
                  : "Draft"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created at",
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
          const formattedDate = dateFormatter(date);
          return <span>{formattedDate}</span>;
        },
      },
      // {
      //   id: "actions",
      //   header: "Actions",
      //   cell: ({ row }) => {
      //     const submission = row.original
      //     return (
      //       <div className="inline-flex items-center">
      //         <AddColaboratorsDialog
      //           trigger={
      //             <Button className="h-8 w-8 p-1" variant={"ghost"}>
      //               <Icons.users className="mr-2 h-4 w-4" color="green" />
      //             </Button>
      //           }
      //           submissionId={submission.id}
      //           formId={submission.formId}
      //         />
      //       </div>
      //     )
      //   },
      // },
    ];

    return staticColumns.concat(dynamicColumns);
  };

  return (
    <div className="overflow-hidden">
      <DataTable columns={columns()} data={submissions || []} />
    </div>
  );
};
