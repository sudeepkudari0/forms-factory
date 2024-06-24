"use client";

import { getteams } from "@/actions/team";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type {} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import CreateteamForm from "./_components/create-team-form";
import { columns } from "./columns";

const teamPage = () => {
  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => await getteams(),
  });
  return (
    <DashboardShell>
      <DashboardHeader heading="team" text="Create and manage your teams.">
        <CreateteamForm
          trigger={
            <Button className="rounded text-white font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4]">
              Create team
            </Button>
          }
        />
      </DashboardHeader>
      <div className="overflow-hidden px-2">
        {teams?.length ? (
          <DataTable columns={columns} data={teams} searchColumn="name" />
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="home" />
            <EmptyPlaceholder.Title>No team created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any teams yet. Create your first one.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
};

export default teamPage;
