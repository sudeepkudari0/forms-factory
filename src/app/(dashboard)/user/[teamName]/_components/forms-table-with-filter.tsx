"use client";

import Loading from "@/app/(auth)/loading";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
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
import { cn } from "@/lib/utils";
import type { Form, Submission, SubmissionAccess, Teams } from "@prisma/client";
import { Check, ChevronsUpDown, PlusCircleIcon } from "lucide-react";
import type { User } from "next-auth";
import type React from "react";
import { useEffect, useState } from "react";
import { columns } from "../columns";
import CreateFormForm from "./create-form-form";
import CreateteamForm from "./create-team-form";

export interface FormWithteams extends Form {
  teams: Teams[];
  submissions: Submission[];
  submissionId?: string | null;
  sharedSubmissions?: (SubmissionAccess & {
    submission: Submission & {
      form: Form;
    };
  })[];
}

interface FormsTableWithFilterProps {
  forms: FormWithteams[];
  teams: Teams[];
  user: User;
  sharedSubmissions?: (SubmissionAccess & {
    submission: Submission & {
      form: Form;
    };
  })[];
}

const FormsTableWithFilter: React.FC<FormsTableWithFilterProps> = ({
  forms,
  teams,
  user,
}) => {
  const [selectedteam, setSelectedteam] = useState<string>("");
  const [isShared, setIsShared] = useState<boolean>(false);
  const [teamOpen, setteamOpen] = useState(false);

  useEffect(() => {
    if (teams?.length) {
      setSelectedteam(teams[0].id);
    }
  }, [teams]);

  const filteredForms = selectedteam
    ? forms
        .filter((form) => form.teams.some((team) => team.id === selectedteam))
        .map((form) => {
          const existingSubmission = form.submissions.find(
            (submission) =>
              submission.formId === form.id && submission.userId === user.id
          );
          return {
            fid: selectedteam,
            uId: user.id,
            ...form,
            submissionId: existingSubmission ? existingSubmission.id : null,
          };
        })
    : forms.map((form) => ({ ...form, submissionId: null }));

  return (
    <div>
      <div className="flex items-center justify-between mr-8">
        <div>
          <Popover open={teamOpen} onOpenChange={setteamOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                disabled={isShared}
                aria-expanded={teamOpen}
                className="w-[200px] justify-between"
              >
                {selectedteam
                  ? teams.find((team) => team.id === selectedteam)?.name
                  : "Filter by team"}

                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                {/* <CommandInput placeholder="Search team..." /> */}
                <CommandEmpty>No team found.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {teams?.map((team) => (
                      <CommandItem
                        key={team?.id}
                        value={team?.id}
                        onSelect={(currentValue) => {
                          const teamId = currentValue;
                          const team = teams.find((team) => team.id === teamId);
                          if (team) {
                            setSelectedteam(teamId);
                          }
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
                    <CommandItem>
                      <CreateteamForm
                        trigger={
                          <div className="rounded flex flex-row h-7 items-center justify-center w-full font-semibold py-2 cursor-pointer">
                            Create team
                            <PlusCircleIcon className="ml-2 h-4 w-4" />
                          </div>
                        }
                        userId={user.id || ""}
                      />
                    </CommandItem>
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <CreateFormForm
          trigger={
            <Button className="rounded text-white font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] ">
              Create Form
            </Button>
          }
          userId={user.id || ""}
          username={user.name || ""}
          teamId={selectedteam}
        />
      </div>
      {filteredForms?.length ? (
        selectedteam ? (
          <DataTable
            columns={columns}
            data={filteredForms as any}
            searchColumn="title"
          />
        ) : (
          <Loading />
        )
      ) : (
        <EmptyPlaceholder className="mt-2">
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>No Forms assigned</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any forms assigned yet.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </div>
  );
};

export default FormsTableWithFilter;
