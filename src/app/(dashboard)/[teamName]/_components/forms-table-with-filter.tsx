"use client";
import { getTeamForms } from "@/actions/forms";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { Form, Teams } from "@prisma/client";
import Cookies from "js-cookie";
import type { User } from "next-auth";
import type React from "react";
import { useEffect, useState } from "react";
import { columns } from "../columns";
import CreateFormForm from "./create-form-form";

export interface FormWithTeams extends Form {
  teams: Teams[];
}

interface FormsTableWithFilterProps {
  user: User;
  tname?: string;
}

const FormsTableWithFilter: React.FC<FormsTableWithFilterProps> = ({
  user,
  tname,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [filteredForms, setFilteredForms] = useState<any[]>([]);
  const [reFetch, setReFetch] = useState(false);

  useEffect(() => {
    const getForms = async () => {
      const tid = Cookies.get("tid");
      if (!tid) {
        console.log("No team ID found in cookies");
        return;
      }
      setSelectedTeam(tid);
      const response = await getTeamForms(tid);
      const updatedForms = response.map((form) => ({
        fid: tid,
        uId: user.id,
        tname,
        ...form,
      }));
      setFilteredForms(updatedForms);
    };
    getForms();
  }, [Cookies, selectedTeam, reFetch, tname, user.id]);

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
          teamId={selectedTeam as string}
          setRefetch={setReFetch}
          refetch={reFetch}
        />
      </div>
      {selectedTeam ? (
        <DataTable
          columns={columns(setReFetch)}
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
