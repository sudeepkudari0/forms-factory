"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type React from "react";
import { useEffect, useState } from "react";

import {
  getFormsByteam,
  getSubmissionsforTheForm,
  getUserteams,
} from "@/actions/submissions";
import { DataTable } from "@/components/ui/data-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { dateFormatter } from "@/lib/utils";
import type { Form, Submission, Teams } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import ExportButton from "./export-button";

import { getUserFormIds } from "@/actions/forms";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export const SubmissionsTable = ({ userId }: { userId: string }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [teams, setteams] = useState<Teams[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedteam, setSelectedteam] = useState<string>("");
  const [selectedForm, setSelectedForm] = useState<string>("");

  const [teamOpen, setteamOpen] = useState(false);
  const [formOpen, setformOpen] = useState(false);

  useEffect(() => {
    const fetchteams = async () => {
      const data = await getUserteams(userId);
      setteams(data);
      if (data.length) {
        setSelectedteam(data[0].id);
      }
    };
    fetchteams();
  }, [userId]);

  useEffect(() => {
    if (selectedteam) {
      const fetchForms = async () => {
        const data = await getFormsByteam(selectedteam);
        const userFormIds = await getUserFormIds(userId);
        const filteredData = data.filter((form) =>
          userFormIds.includes(form.id)
        );
        setForms(filteredData);
      };
      fetchForms();
    }
  }, [selectedteam, selectedForm]);

  useEffect(() => {
    if (selectedForm) {
      const fetchSubmissions = async () => {
        const data = await getSubmissionsforTheForm(selectedForm);
        setSubmissions(data);
      };
      fetchSubmissions();
    }
  }, [selectedForm, selectedteam]);

  const _handleFormChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedForm(event.target.value);
  };

  const columns = () => {
    const allKeys = submissions
      .reduce<string[]>((keys, submission) => {
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
      cell: ({ row, cell }) => {
        const data =
          typeof row.original.data === "string"
            ? JSON.parse(row.original.data)
            : {};
        const value = cell.getValue() as string;

        if (value?.startsWith("https://utfs.io")) {
          const fileName = data.fileName;
          return (
            <p>
              <Link
                href={value}
                target="_blank"
                className="font-bold text-blue-600 underline"
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
    ];

    return staticColumns.concat(dynamicColumns);
  };

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex flex-row gap-4">
          <div>
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
                    : "No teams available"}

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
          </div>
          <div>
            <Popover open={formOpen} onOpenChange={setformOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={formOpen}
                  className="w-[200px] justify-between"
                >
                  {selectedteam && selectedForm
                    ? forms.find((form) => form.id === selectedForm)?.title
                    : "select forms..."}

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  {/* <CommandInput placeholder="Search team..." /> */}
                  <CommandEmpty>No form found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {forms.map((form) => (
                        <CommandItem
                          key={form?.id}
                          value={form?.id}
                          onSelect={(currentValue) => {
                            setSelectedForm(
                              currentValue === selectedForm ? "" : currentValue
                            );
                            setformOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedteam === form?.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {form?.title}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div>
          <ExportButton formId={selectedForm} />
        </div>
      </div>
      <DataTable columns={columns()} data={submissions} />
    </div>
  );
};
