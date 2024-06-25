"use client";

import { getAllFormsNotInAnyteam, getForminteam } from "@/actions/forms";
import { addFormsToteam, removeFormsFromteam } from "@/actions/team";
import { Icons } from "@/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "@/components/ui/use-toast";
import type { Form, Teams } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface FormsToteamProps {
  team: Teams;
}

export const FormsToteam = ({ team }: FormsToteamProps) => {
  const queryClient = useQueryClient();

  const [selectedAddFormIds, setSelectedAddFormIds] = useState<string[]>([]);
  const [selectedRemoveFormIds, setSelectedRemoveFormIds] = useState<string[]>(
    []
  );

  const { data: allforms, isLoading: _allFormsLoading } = useQuery({
    queryKey: ["allFormsNotInteam", team.id],
    queryFn: async () => await getAllFormsNotInAnyteam(),
    placeholderData: [],
  });

  const { data: teamForms, isLoading: _teamFormsLoading } = useQuery({
    queryKey: ["teamForms", team.id],
    queryFn: async () => await getForminteam(team.id),
    placeholderData: [],
  });

  const { mutate: addFormsToteamMutate } = useMutation({
    mutationFn: async (values: { teamId: string; formIds: string[] }) =>
      await addFormsToteam(values),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["allFormsNotInteam", team.id],
      });
      await queryClient.cancelQueries({
        queryKey: ["teamForms", team.id],
      });

      const prevAllForms = queryClient.getQueryData<Form[]>([
        "allFormsNotInteam",
        team.id,
      ]);
      const prevteamForms = queryClient.getQueryData<Form[]>([
        "teamForms",
        team.id,
      ]);

      queryClient.setQueryData(
        ["allFormsNotInteam", team.id],
        (old: Form[] | undefined) =>
          old?.filter((form) => !variables.formIds.includes(form.id))
      );

      queryClient.setQueryData(
        ["teamForms", team.id],
        (old: Form[] | undefined) => [
          ...(old || []),
          ...prevAllForms?.filter((form) =>
            variables.formIds.includes(form.id)
          )!,
        ]
      );

      return { prevAllForms, prevteamForms };
    },
    onError: (_err, _variables, context) => {
      if (context?.prevAllForms) {
        queryClient.setQueryData(
          ["allFormsNotInteam", team.id],
          context.prevAllForms
        );
      }
      if (context?.prevteamForms) {
        queryClient.setQueryData(["teamForms", team.id], context.prevteamForms);
      }
      toast({
        title: "Error",
        description: "Failed to add forms to team",
      });
    },
    onSuccess: () => {
      toast({
        title: "team Updated",
        description: "Forms added to team successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["allFormsNotInteam", team.id],
      });
      queryClient.invalidateQueries({ queryKey: ["teamForms", team.id] });
    },
  });

  const { mutate: removeFormsFromteamMutate } = useMutation({
    mutationFn: async (values: { teamId: string; formIds: string[] }) =>
      await removeFormsFromteam(values),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["allFormsNotInteam", team.id],
      });
      await queryClient.cancelQueries({
        queryKey: ["teamForms", team.id],
      });

      const prevAllForms = queryClient.getQueryData<Form[]>([
        "allFormsNotInteam",
        team.id,
      ]);
      const prevteamForms = queryClient.getQueryData<Form[]>([
        "teamForms",
        team.id,
      ]);

      queryClient.setQueryData(
        ["teamForms", team.id],
        (old: Form[] | undefined) =>
          old?.filter((form) => !variables.formIds.includes(form.id))
      );

      queryClient.setQueryData(
        ["allFormsNotInteam", team.id],
        (old: Form[] | undefined) => [
          ...(old || []),
          ...prevteamForms?.filter((form) =>
            variables.formIds.includes(form.id)
          )!,
        ]
      );

      return { prevAllForms, prevteamForms };
    },
    onError: (_err, _variables, context) => {
      if (context?.prevAllForms) {
        queryClient.setQueryData(
          ["allFormsNotInteam", team.id],
          context.prevAllForms
        );
      }
      if (context?.prevteamForms) {
        queryClient.setQueryData(["teamForms", team.id], context.prevteamForms);
      }

      toast({
        title: "Error",
        description: "Failed to remove forms from team",
      });
    },
    onSuccess: () => {
      toast({
        title: "team Updated",
        description: "Forms removed from team successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["allFormsNotInteam", team.id],
      });
      queryClient.invalidateQueries({ queryKey: ["teamForms", team.id] });
    },
  });

  const handleAddSelectAll = (isChecked: boolean) => {
    if (allforms) {
      setSelectedAddFormIds(isChecked ? allforms.map((form) => form.id) : []);
    }
  };

  const handleRemoveSelectAll = (isChecked: boolean) => {
    if (teamForms) {
      setSelectedRemoveFormIds(
        isChecked ? teamForms.map((form) => form.id) : []
      );
    }
  };

  const handleAddSelectForm = (id: string) => {
    const newSelection = [...selectedAddFormIds];
    if (newSelection.includes(id)) {
      newSelection.splice(newSelection.indexOf(id), 1);
    } else {
      newSelection.push(id);
    }
    setSelectedAddFormIds(newSelection);
  };

  const handleRemoveSelectForm = (id: string) => {
    const newSelection = [...selectedRemoveFormIds];
    if (newSelection.includes(id)) {
      newSelection.splice(newSelection.indexOf(id), 1);
    } else {
      newSelection.push(id);
    }
    setSelectedRemoveFormIds(newSelection);
  };

  const isAllAddSelected = selectedAddFormIds.length === allforms?.length;

  const isAllRemoveSelected =
    selectedRemoveFormIds.length === teamForms?.length;

  return (
    <div className="flex space-x-2 px-0 custom-1200:px-[150px]">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>All Forms</CardTitle>
          <CardDescription>Add forms to {team.name} team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center">
            <Input
              type="checkbox"
              className="h-4 w-4 mr-4"
              checked={isAllAddSelected}
              onChange={(e) => handleAddSelectAll(e.target.checked)}
            />
            <span className="text-xl">Form Names</span>
          </div>
          <hr />
          <ul className="list-none space-y-3">
            {allforms?.map((form) => (
              <li key={form.id} className="flex items-center">
                <Input
                  type="checkbox"
                  className="mr-4 h-4 w-4"
                  checked={selectedAddFormIds.includes(form.id)}
                  onChange={() => handleAddSelectForm(form.id)}
                />
                <span>{form.title}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="flex flex-col items-center justify-center">
        <LoadingButton
          variant={"secondary"}
          onClick={() =>
            addFormsToteamMutate({
              teamId: team.id,
              formIds: selectedAddFormIds,
            })
          }
          className="mb-4"
        >
          <Icons.arrow_right className="h-8 w-8 text-green-600 " />
        </LoadingButton>
        <LoadingButton
          variant={"secondary"}
          onClick={() =>
            removeFormsFromteamMutate({
              teamId: team.id,
              formIds: selectedRemoveFormIds,
            })
          }
        >
          <Icons.arrowLeft className="h-8 w-8 text-red-600" />
        </LoadingButton>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{team.name}</CardTitle>
          <CardDescription>Remove forms from {team.name} team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center">
            <Input
              type="checkbox"
              className="h-4 w-4 mr-4"
              checked={isAllRemoveSelected}
              onChange={(e) => handleRemoveSelectAll(e.target.checked)}
            />
            <span className="text-xl">Form Names</span>
          </div>
          <hr />
          <ul className="list-none space-y-3">
            {teamForms?.map((form) => (
              <li key={form.id} className="flex items-center">
                <Input
                  type="checkbox"
                  className="mr-4 h-4 w-4"
                  checked={selectedRemoveFormIds.includes(form.id)}
                  onChange={() => handleRemoveSelectForm(form.id)}
                />
                <span>{form.title}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
