"use client";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import {} from "@/components/ui/command";
import { DataTable } from "@/components/ui/data-table";
import {} from "@/components/ui/popover";
import type { Form, Submission, SubmissionAccess, Teams } from "@prisma/client";
import Cookies from "js-cookie";
import {} from "lucide-react";
import type { User } from "next-auth";
import type React from "react";
import { useEffect, useState } from "react";
import { columns } from "../columns";
import CreateFormForm from "./create-form-form";

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
  tname?: string;
}

const FormsTableWithFilter: React.FC<FormsTableWithFilterProps> = ({
  forms,
  teams,
  user,
  tname,
}) => {
  const [selectedteam, setSelectedteam] = useState<string>("");

  let filteredForms: string | any[] = [];

  useEffect(() => {
    const tid = Cookies.get("tid");
    const tname = Cookies.get("tname");
    if (tid) {
      setSelectedteam(tid);
    }
    filteredForms = selectedteam
      ? forms
          .filter((form) => form.teams.some((team) => team.id === tid))
          .map((form) => {
            const existingSubmission = form.submissions.find(
              (submission) =>
                submission.formId === form.id && submission.userId === user.id
            );
            return {
              fid: selectedteam,
              uId: user.id,
              ...form,
              tname,
              submissionId: existingSubmission ? existingSubmission.id : null,
            };
          })
      : forms.map((form) => ({ ...form, submissionId: null }));
  }, [Cookies]);

  return (
    <div>
      <div className="flex items-center justify-between mr-8">
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
      {filteredForms.length > 0 && selectedteam ? (
        <DataTable
          columns={columns}
          data={filteredForms as any}
          searchColumn="title"
        />
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
