"use client";

import { getUserteams } from "@/actions/team";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Teams } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { SubmissionsTable } from "./users-table";

import { getUsersandPlus } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const TeamsSelect = ({ teams }: { teams: Teams[] }) => {
  const [open, setOpen] = useState(false);
  const [selectedteam, setSelectedteam] = useState<string>();

  const { data: filteredUsers, isLoading: _filteredUsersLoading } = useQuery({
    queryKey: ["filteredUsers", selectedteam],
    queryFn: async () => {
      if (selectedteam) {
        const data = await getUserteams(selectedteam);
        return data || [];
      }
      const data = await getUsersandPlus();
      return data || [];
    },
  });

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
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
                {teams.map((team) => (
                  <CommandItem
                    key={team?.id}
                    value={team?.id}
                    onSelect={(currentValue) => {
                      setSelectedteam(
                        currentValue === selectedteam ? "" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedteam === team?.id ? "opacity-100" : "opacity-0"
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
      <SubmissionsTable users={filteredUsers || []} />
    </div>
  );
};

export default TeamsSelect;
