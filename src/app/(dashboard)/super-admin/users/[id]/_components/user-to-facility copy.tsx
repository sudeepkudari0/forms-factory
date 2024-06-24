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
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "@/components/ui/use-toast";
import type { Teams, User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import DashboardSettingsLoading from "../manage/_components/loading";

export const UserToteam = (user: { user: User }) => {
  const queryClient = useQueryClient();

  const [selectedAddteamIds, setSelectedAddteamIds] = useState<string[]>([]);
  const [selectedRemoveteamIds, setSelectedRemoveteamIds] = useState<string[]>(
    []
  );

  const { data: allteams, isLoading: allteamsLoading } = useQuery({
    queryKey: ["allteams"],
    queryFn: async () => await userNotInteam(user.user.id),
    placeholderData: [],
  });

  const { data: userteam, isLoading: userteamLoading } = useQuery({
    queryKey: ["userteam"],
    queryFn: async () => await userInteam(user.user.id),
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
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allteams"] });
      queryClient.invalidateQueries({ queryKey: ["userteam"] });
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
        isChecked ? userteam.map((team) => team.id) : []
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

  const handleRemoveSelectteam = (id: string, _name: string) => {
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
    <div className="flex flex-row w-full space-x-4">
      <Card className="w-full min-w-max">
        <CardHeader>
          <CardTitle>All teams</CardTitle>
          <CardDescription>Add teams to {user.user.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
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
          variant={"link"}
          onClick={() =>
            addUserToteamsMutate({
              userId: user.user.id,
              teamIds: selectedAddteamIds,
            })
          }
          className="mb-2 hover:bg-gray-100"
        >
          <Icons.arrow_right className="h-8 w-8 text-green-600 " />
        </LoadingButton>
        <LoadingButton
          variant={"link"}
          onClick={() =>
            removeUserFromteamMutate({
              userId: user.user.id,
              teamIds: selectedRemoveteamIds,
            })
          }
        >
          <Icons.arrowLeft className="h-8 w-8 text-red-600" />
        </LoadingButton>
      </div>
      <Card className="w-full min-w-max">
        <CardHeader>
          <CardTitle>{user.user.name}</CardTitle>
          <CardDescription>Remove teams from {user.user.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 w-full">
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
            {userteam?.map((user) => (
              <li key={user.id} className="flex items-center">
                <Input
                  type="checkbox"
                  className="mr-4 h-4 w-4"
                  checked={selectedRemoveteamIds.includes(user.id)}
                  onChange={() => handleRemoveSelectteam(user.id, user.name)}
                />
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
