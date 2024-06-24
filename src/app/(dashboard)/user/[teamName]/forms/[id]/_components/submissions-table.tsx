"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";

import {
  getAllSubmissionsForForm,
  getUsersForteam,
  getteamsForForm,
} from "@/actions/submissions";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DataTable } from "@/components/ui/data-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, dateFormatter } from "@/lib/utils";
import {
  type Submission,
  SubmissionStatus,
  type Teams,
  type User,
} from "@prisma/client";
import { CircleIcon } from "lucide-react";
import { Check, ChevronsUpDown } from "lucide-react";
import ExportButton from "./export-button";

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
      cell: ({ row, cell }) => {
        const data =
          typeof row.original.data === "string"
            ? JSON.parse(row.original.data)
            : {};
        const value = cell.getValue() as string;

        const _fileNameKey = `${key}_FileName` as keyof typeof data;

        if (value?.startsWith("https://")) {
          const fileName = data[key] as string;
          return (
            <p>
              <Link
                href={value}
                target="_blank"
                className="font-bold underline"
              >
                {fileName}
              </Link>
            </p>
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
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Popover open={teamOpen} onOpenChange={setteamOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={teamOpen}
                className="w-[200px] justify-between"
              >
                {selectedteam
                  ? teams.find((team) => team.id === selectedteam)?.name
                  : "Filter team..."}

                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                {/* <CommandInput placeholder="Search team..." /> */}
                <CommandEmpty>No team found.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {teams.map((team) => (
                      <CommandItem
                        key={team?.id}
                        value={team?.id}
                        onSelect={(currentValue) => {
                          setSelectedteam(
                            currentValue === selectedteam ? "" : currentValue
                          );
                          setteamOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedteam === team?.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {team?.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={userOpen} onOpenChange={setUserOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={userOpen}
                className="w-[200px] justify-between"
              >
                {selectedteam && selectedUser
                  ? users.find((user) => user.id === selectedUser)?.name
                  : "Filter user..."}

                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                {/* <CommandInput placeholder="Search team..." /> */}
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {users.map((user) => (
                      <CommandItem
                        key={user?.id}
                        value={user?.id}
                        onSelect={(currentValue) => {
                          setSelectedUser(
                            currentValue === selectedUser ? "" : currentValue
                          );
                          setUserOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedUser === user?.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {user?.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <ExportButton
            formId={formId}
            selectedUser={selectedUser}
            selectedteam={selectedteam}
          />
        </div>
      </div>
      <DataTable columns={columns()} data={filteredSubmissions} />
    </div>
  );
};
