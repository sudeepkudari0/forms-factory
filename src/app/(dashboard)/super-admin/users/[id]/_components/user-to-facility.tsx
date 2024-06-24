"use client";

import { addFormsToUser, removeFormsFromUser } from "@/actions/forms";
import { getAllteamFormsNotInUser, getteamFormsInUser } from "@/actions/forms";
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
import { cn } from "@/lib/utils";
import type { Form, Teams } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface teamWithForms extends Teams {
  forms: Form[];
}

interface teamFormsToUserProps {
  userId: string;
}

const teamFormsToUser = ({ userId }: teamFormsToUserProps) => {
  const queryClient = useQueryClient();

  const [selectedAddFormIds, setSelectedAddFormIds] = useState<string[]>([]);
  const [selectedRemoveFormIds, setSelectedRemoveFormIds] = useState<string[]>(
    []
  );

  const { data: teamsNotInUser, isLoading: teamsNotInUserLoading } = useQuery({
    queryKey: ["allteamFormsNotInUser", userId],
    queryFn: async () => await getAllteamFormsNotInUser(userId),
    placeholderData: [],
  });

  const { data: teamsInUser, isLoading: teamsInUserLoading } = useQuery({
    queryKey: ["teamFormsInUser", userId],
    queryFn: async () => await getteamFormsInUser(userId),
    placeholderData: [],
  });

  const { mutate: addFormsToUserMutate } = useMutation({
    mutationFn: async (formIds: string[]) =>
      await addFormsToUser({ userId, formIds }),
    onMutate: async (formIds) => {
      await queryClient.cancelQueries({
        queryKey: ["allteamFormsNotInUser", userId],
      });
      await queryClient.cancelQueries({
        queryKey: ["teamFormsInUser", userId],
      });

      const prevAllteamFormsNotInUser: teamWithForms[] | undefined =
        queryClient.getQueryData(["allteamFormsNotInUser", userId]);

      const prevteamFormsInUser: teamWithForms[] | undefined =
        queryClient.getQueryData(["teamFormsInUser", userId]);

      queryClient.setQueryData(
        ["allteamFormsNotInUser", userId],
        (prev: teamWithForms[] | undefined) => {
          if (!prev) {
            return prev;
          }
          return prev.map((team) => ({
            ...team,
            forms: team.forms.filter((form) => !formIds.includes(form.id)),
          }));
        }
      );

      queryClient.setQueryData(
        ["teamFormsInUser", userId],
        (prev: teamWithForms[] | undefined) => {
          if (!prev) {
            return prev;
          }
          return prev.map((team) => ({
            ...team,
            forms: [
              ...team.forms,
              ...(prevAllteamFormsNotInUser || []).flatMap((f) =>
                f.forms.filter((form) => formIds.includes(form.id))
              ),
            ],
          }));
        }
      );

      return { prevAllteamFormsNotInUser, prevteamFormsInUser };
    },
    onSuccess: () => {
      toast({
        title: "User Updated",
        description: "Forms added to user successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["allteamFormsNotInUser", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["teamFormsInUser", userId],
      });
    },
    onError: (_error, _formIds, context) => {
      toast({
        title: "Error",
        description: "Failed to add forms to user",
      });
      if (context) {
        queryClient.setQueryData(
          ["allteamFormsNotInUser", userId],
          context.prevAllteamFormsNotInUser
        );
        queryClient.setQueryData(
          ["teamFormsInUser", userId],
          context.prevteamFormsInUser
        );
      }
    },
  });

  const { mutate: removeFormsFromUserMutate } = useMutation({
    mutationFn: async (formIds: string[]) =>
      await removeFormsFromUser({ userId, formIds }),
    onMutate: async (formIds) => {
      await queryClient.cancelQueries({
        queryKey: ["allteamFormsNotInUser", userId],
      });
      await queryClient.cancelQueries({
        queryKey: ["teamFormsInUser", userId],
      });

      const prevAllteamFormsNotInUser: teamWithForms[] | undefined =
        queryClient.getQueryData(["allteamFormsNotInUser", userId]);

      const prevteamFormsInUser: teamWithForms[] | undefined =
        queryClient.getQueryData(["teamFormsInUser", userId]);

      queryClient.setQueryData(
        ["allteamFormsNotInUser", userId],
        (prev: teamWithForms[] | undefined) => {
          if (!prev) {
            return prev;
          }
          return prev.map((team) => ({
            ...team,
            forms: [
              ...team.forms,
              ...(prevteamFormsInUser || []).flatMap((f) =>
                f.forms.filter((form) => formIds.includes(form.id))
              ),
            ],
          }));
        }
      );

      queryClient.setQueryData(
        ["teamFormsInUser", userId],
        (prev: teamWithForms[] | undefined) => {
          if (!prev) {
            return prev;
          }
          return prev.map((team) => ({
            ...team,
            forms: team.forms.filter((form) => !formIds.includes(form.id)),
          }));
        }
      );

      return { prevAllteamFormsNotInUser, prevteamFormsInUser };
    },
    onSuccess: () => {
      toast({
        title: "User Updated",
        description: "Forms removed from user successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["allteamFormsNotInUser", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["teamFormsInUser", userId],
      });
    },
    onError: (_error, _formIds, context) => {
      toast({
        title: "Error",
        description: "Failed to remove forms from user",
      });
      if (context) {
        queryClient.setQueryData(
          ["allteamFormsNotInUser", userId],
          context.prevAllteamFormsNotInUser
        );
        queryClient.setQueryData(
          ["teamFormsInUser", userId],
          context.prevteamFormsInUser
        );
      }
    },
  });

  const handleAddSelectForm = (formId: string) => {
    setSelectedAddFormIds((prev) =>
      prev.includes(formId)
        ? prev.filter((id) => id !== formId)
        : [...prev, formId]
    );
  };

  const handleRemoveSelectForm = (formId: string) => {
    setSelectedRemoveFormIds((prev) =>
      prev.includes(formId)
        ? prev.filter((id) => id !== formId)
        : [...prev, formId]
    );
  };

  const handleAddFormsToUser = () => {
    addFormsToUserMutate(selectedAddFormIds);
  };

  const handleRemoveFormsFromUser = () => {
    removeFormsFromUserMutate(selectedRemoveFormIds);
  };

  if (teamsNotInUserLoading || teamsInUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex space-x-2 px-0 custom-1200:px-[150px]">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>All Forms Not Associated with User</CardTitle>
          <CardDescription>Add forms to user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 h-[250px] overflow-auto">
          {teamsNotInUser?.map((team) => (
            <div key={team.id} className="mb-4">
              <div className="flex items-center">
                <span
                  className={cn(
                    team.forms.length > 0
                      ? "text-primary text-lg font-medium pb-2"
                      : "text-muted-foreground"
                  )}
                >
                  {team.forms.length > 0 ? (
                    team.name
                  ) : (
                    <p>
                      {team.name}{" "}
                      <span className="text-xs text-gray-500">(No Forms)</span>{" "}
                    </p>
                  )}
                </span>
              </div>
              <ul className="list-none space-y-3 ml-6">
                {team.forms.map((form) => (
                  <li key={form.formId} className="flex items-center">
                    <Input
                      type="checkbox"
                      className="mr-4 h-4 w-4"
                      checked={selectedAddFormIds.includes(form.formId)}
                      onChange={() => handleAddSelectForm(form.formId)}
                    />
                    <span className="text-primary">{form?.form?.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex flex-col items-center justify-center">
        <LoadingButton
          variant={"secondary"}
          onClick={handleAddFormsToUser}
          className="mb-4"
        >
          <Icons.arrow_right className="h-8 w-8 text-green-600 " />
        </LoadingButton>
        <LoadingButton
          variant={"secondary"}
          onClick={handleRemoveFormsFromUser}
        >
          <Icons.arrowLeft className="h-8 w-8 text-red-600" />
        </LoadingButton>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>teams & Forms Associated with User</CardTitle>
          <CardDescription>Remove forms from user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 h-[250px] overflow-auto">
          {teamsInUser?.map((team) => (
            <div key={team.id} className="mb-4">
              <div className="flex items-center">
                <span className="text-primary text-lg pb-2 font-medium">
                  {team.name}
                </span>
              </div>
              <ul className="list-none space-y-3 ml-6">
                {team.forms.map((form) => (
                  <li key={form.formId} className="flex items-center">
                    <Input
                      type="checkbox"
                      className="mr-4 h-4 w-4"
                      checked={selectedRemoveFormIds.includes(form.formId)}
                      onChange={() => handleRemoveSelectForm(form.formId)}
                    />
                    <span className="text-primary">{form.form.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default teamFormsToUser;
