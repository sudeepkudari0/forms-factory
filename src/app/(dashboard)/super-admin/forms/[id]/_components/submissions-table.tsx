"use client";

import { getAllSubmissionsForForm } from "@/actions/submissions";
import {} from "@/components/ui/command";
import { DataTable } from "@/components/ui/data-table";
import { LoadingButton } from "@/components/ui/loading-button";
import {} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { cn, dateFormatter, exportSubmissionsToExcel } from "@/lib/utils";
import { type Submission, SubmissionStatus } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { CircleIcon, EyeIcon } from "lucide-react";
import {} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const SubmissionsTable = ({ formId }: { formId: string }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const data = await getAllSubmissionsForForm(formId);
      setSubmissions(data);
    };

    fetchSubmissions();
  }, [formId]);

  const columns = () => {
    const allKeys = submissions.reduce<string[]>((keys, submission) => {
      const submissionKeys = Object.getOwnPropertyNames(
        JSON.parse(submission.data as string)
      );
      return keys.concat(submissionKeys);
    }, []);
    // .filter((key) => key.endsWith("FileName") || key.endsWith("FileUrl"));
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
        accessorKey: "createdAt",
        header: "Created at",
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
          const formattedDate = dateFormatter(date);
          return <span>{formattedDate}</span>;
        },
      },
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
    ];

    return staticColumns.concat(dynamicColumns);
  };

  const handleExportToExcel = async (submissions: Submission[]) => {
    if (!submissions) {
      toast({
        title: "Error",
        description: "No submissions to export",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    await exportSubmissionsToExcel(submissions);
    setLoading(false);
  };

  return (
    <div className="overflow-hidden">
      <DataTable
        columns={columns()}
        data={submissions}
        actions={
          <LoadingButton
            loading={loading}
            onClick={() => handleExportToExcel(submissions)}
            variant={"outline"}
            className=""
          >
            Export to Excel
          </LoadingButton>
        }
      />
    </div>
  );
};
