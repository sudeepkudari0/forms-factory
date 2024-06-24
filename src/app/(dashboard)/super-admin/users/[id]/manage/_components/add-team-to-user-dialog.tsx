"use client";

import {
  addUserToteams,
  removeUserFromteam,
  userInteam,
  userNotInteam,
} from "@/actions/users";
import { Icons } from "@/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "@/components/ui/use-toast";
import type { Teams, User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import React from "react";
import DashboardSettingsLoading from "./loading";

interface UserToteamProps {
  user: User;
  trigger: React.ReactElement;
}

export const AddteamToUserDialog = ({ user, trigger }: UserToteamProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const [selectedAddteamIds, setSelectedAddteamIds] = useState<string[]>([]);
  const [selectedRemoveteamIds, setSelectedRemoveteamIds] = useState<string[]>(
    []
  );

  const { data: allteams, isLoading: allteamsLoading } = useQuery({
    queryKey: ["allteams"],
    queryFn: async () => await userNotInteam(user.id),
    placeholderData: [],
  });

  const { data: userteam, isLoading: userteamLoading } = useQuery({
    queryKey: ["userteam"],
    queryFn: async () => await userInteam(user.id),
    placeholderData: [],
  });

  const { mutate: addUserToteamsMutate } = useMutation({
    mutationFn: async (values: { userId: string; teamIds: string[] }) =>
      await addUserToteams(values),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["allteams"] });
      await queryClient.cancelQueries({ queryKey: ["userteam"] });

      const prevAllteams: Teams[] | undefined = queryClient.getQueryData([
        "allteams",
      ]);
      const prevUserteam = queryClient.getQueryData(["userteam"]);

      queryClient.setQueryData(["allteams"], (old: any) =>
        old.filter((team: any) => !variables.teamIds.includes(team.id))
      );

      queryClient.setQueryData(["userteam"], (old: any) => [
        ...old,
        ...(prevAllteams || []).filter((team: any) =>
          variables.teamIds.includes(team.id)
        ),
      ]);

      return { prevAllteams, prevUserteam };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["allteams"], context?.prevAllteams);
      queryClient.setQueryData(["userteam"], context?.prevUserteam);

      toast({
        title: "Error",
        description: "Failed to add teams to user",
      });
    },
    onSuccess: () => {
      toast({
        title: "User Updated",
        description: "teams added to user successfully",
      });
      setSelectedAddteamIds([]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allteams"] });
      queryClient.invalidateQueries({ queryKey: ["userteam"] });
      queryClient.invalidateQueries({
        queryKey: ["allteamFormsNotInUser", user.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["teamFormsInUser", user.id],
      });
    },
  });

  const { mutate: removeUserFromteamMutate } = useMutation({
    mutationFn: async (values: { userId: string; teamIds: string[] }) =>
      await removeUserFromteam(values),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["allteams"] });
      await queryClient.cancelQueries({ queryKey: ["userteam"] });

      const prevAllteams: Teams[] | undefined = queryClient.getQueryData([
        "allteams",
      ]);
      const prevUserteam: Teams[] | undefined = queryClient.getQueryData([
        "userteam",
      ]);

      queryClient.setQueryData(["userteam"], (old: any) =>
        old.filter((team: any) => !variables.teamIds.includes(team.id))
      );

      queryClient.setQueryData(["allteams"], (old: any) => [
        ...old,
        ...(prevUserteam || []).filter((team: any) =>
          variables.teamIds.includes(team.id)
        ),
      ]);

      return { prevAllteams, prevUserteam };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["allteams"], context?.prevAllteams);
      queryClient.setQueryData(["userteam"], context?.prevUserteam);

      toast({
        title: "Error",
        description: "Failed to remove teams from user",
      });
    },
    onSuccess: () => {
      toast({
        title: "User Updated",
        description: "teams removed from user successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allteams"] });
      queryClient.invalidateQueries({ queryKey: ["userteam"] });
      queryClient.invalidateQueries({
        queryKey: ["allteamFormsNotInUser", user.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["teamFormsInUser", user.id],
      });
    },
  });

  if (allteamsLoading && userteamLoading) {
    return <DashboardSettingsLoading />;
  }

  const handleAddSelectAll = (isChecked: boolean) => {
    if (allteams) {
      setSelectedAddteamIds(isChecked ? allteams.map((team) => team.id) : []);
    }
  };

  const handleRemoveSelectAll = (isChecked: boolean) => {
    if (userteam) {
      setSelectedRemoveteamIds(
        isChecked ? userteam.map((team: { id: any }) => team.id) : []
      );
    }
  };

  const handleAddSelectteam = (id: string, _name: string) => {
    const newSelection = [...selectedAddteamIds];
    if (newSelection.includes(id)) {
      newSelection.splice(newSelection.indexOf(id), 1);
    } else {
      newSelection.push(id);
    }
    setSelectedAddteamIds(newSelection);
  };

  const handleRemoveSelectteam = (id: string) => {
    const newSelection = [...selectedRemoveteamIds];
    if (newSelection.includes(id)) {
      newSelection.splice(newSelection.indexOf(id), 1);
    } else {
      newSelection.push(id);
    }
    setSelectedRemoveteamIds(newSelection);
  };

  const isAllAddSelected = selectedAddteamIds.length === allteams?.length;

  const isAllRemoveSelected = selectedRemoveteamIds.length === userteam?.length;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        {React.cloneElement(trigger, {
          onClick: () => setIsOpen(true),
        })}
      </DialogTrigger>
      <DialogContent className="w-full min-w-max rounded">
        <div className="flex flex-row w-full space-x-4">
          <Card className="w-full min-w-max">
            <CardHeader>
              <CardTitle>All teams</CardTitle>
              <CardDescription>Add teams to {user.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 h-[250px] overflow-auto">
              <div className="flex items-center">
                <Input
                  type="checkbox"
                  className="h-4 w-4 mr-4"
                  checked={isAllAddSelected}
                  onChange={(e) => handleAddSelectAll(e.target.checked)}
                />
              </div>
              <hr />
              <ul className="list-none space-y-3">
                {allteams?.map((team) => (
                  <li key={team.id} className="flex items-center">
                    <Input
                      type="checkbox"
                      className="mr-4 h-4 w-4"
                      checked={selectedAddteamIds.includes(team.id)}
                      onChange={() => handleAddSelectteam(team.id, team.name)}
                    />
                    <span>{team.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <div className="flex flex-col items-center justify-center">
            <LoadingButton
              variant={"secondary"}
              onClick={() =>
                addUserToteamsMutate({
                  userId: user.id,
                  teamIds: selectedAddteamIds,
                })
              }
              className="mb-4"
            >
              <Icons.arrow_right className="h-8 w-8 text-green-600 " />
            </LoadingButton>
            <LoadingButton
              variant={"secondary"}
              onClick={() =>
                removeUserFromteamMutate({
                  userId: user.id,
                  teamIds: selectedRemoveteamIds,
                })
              }
            >
              <Icons.arrowLeft className="h-8 w-8 text-red-600" />
            </LoadingButton>
          </div>
          <Card className="w-full min-w-max">
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>Remove teams from {user.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 w-full h-[250px] overflow-auto">
              <div className="flex items-center">
                <Input
                  type="checkbox"
                  className="h-4 w-4 mr-4"
                  checked={isAllRemoveSelected}
                  onChange={(e) => handleRemoveSelectAll(e.target.checked)}
                />
              </div>
              <hr />
              <ul className="list-none space-y-3">
                {userteam?.map((user: any) => (
                  <li key={user.id} className="flex items-center">
                    <Input
                      type="checkbox"
                      className="mr-4 h-4 w-4"
                      checked={selectedRemoveteamIds.includes(user.id)}
                      onChange={() => handleRemoveSelectteam(user.id)}
                    />
                    <span>{user.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
