"use client";

import {
  getAllSubmissionsForForm,
  getUsersForteam,
  getteamsForForm,
} from "@/actions/submissions";
import {} from "@/components/ui/command";
import { DataTable } from "@/components/ui/data-table";
import {} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, dateFormatter } from "@/lib/utils";
import {
  type Submission,
  SubmissionStatus,
  type Teams,
  type User,
} from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { CircleIcon, EyeIcon } from "lucide-react";
import {} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";

export const SubmissionsTable = ({ formId }: { formId: string }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [teams, setteams] = useState<Teams[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedteam, setSelectedteam] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const [teamOpen, setteamOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const data = await getAllSubmissionsForForm(formId);
      setSubmissions(data);
    };
    const fetchteams = async () => {
      const teamsData = await getteamsForForm(formId);
      setteams(teamsData);
    };

    fetchSubmissions();
    fetchteams();
  }, [formId]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (selectedteam) {
        const usersData = await getUsersForteam(selectedteam);
        const filteredUsers = usersData.filter((user) =>
          user.forms.some((form) => form.id === formId)
        );
        setUsers(filteredUsers);
      }
    };
    fetchUsers();
  }, [selectedteam]);

  const _handleteamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedteam(event.target.value);
    setSelectedUser(null); // Reset user selection when team changes
  };

  const _handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value);
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (selectedUser) {
      return submission.userId === selectedUser;
    }
    return true;
  });

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

  return (
    <div className="overflow-hidden">
      <DataTable columns={columns()} data={filteredSubmissions} />
    </div>
  );
};
