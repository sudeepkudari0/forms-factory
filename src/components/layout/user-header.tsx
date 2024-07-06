"use client";

import CreateteamForm from "@/app/(dashboard)/[teamName]/_components/create-team-form";
import { InviteUserForm } from "@/app/(dashboard)/[teamName]/_components/invite-user-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { type Teams, UserRole, type UserTeam } from "@prisma/client";
import Cookies from "js-cookie";
import { Check, ChevronsUpDown, PlusCircleIcon } from "lucide-react";
import type { User } from "next-auth";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { UserAccountNav } from "../user-account-nav";
import { UserNav } from "../user-nav";

type teams = UserTeam & {
  team: Teams;
};

const Header = ({ user, teams = [] }: { user?: User; teams?: teams[] }) => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const [selectedteam, setSelectedteam] = useState<string | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState<string | null>(null);
  const [teamOpen, setteamOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initialTeam = Cookies.get("tid") || "";
    setSelectedteam(initialTeam);
    if (initialTeam && teams.length > 0) {
      const initialTeamData = teams.find((team) => team.teamId === initialTeam);
      if (initialTeamData) {
        setSelectedTeamName(initialTeamData.team.name);
      }
    }
  }, [teams]);

  useEffect(() => {
    if (selectedteam && teams.length > 0) {
      const selectedTeamData = teams.find(
        (team) => team.teamId === selectedteam
      );
      if (selectedTeamData) {
        setSelectedTeamName(selectedTeamData.team.name);
        const tname = selectedTeamData.team.name.replace(/\s+/g, "-");
        router.refresh();
        router.push(`/${tname}`);
        Cookies.set("tid", selectedteam, { path: "/" });
        Cookies.set("tname", tname, { path: "/" });
      }
    }
  }, [selectedteam]);

  return (
    <div
      className={cn(
        "sticky inset-x-0 top-0 z-30 w-full border-b transition-all",
        {
          "border-b backdrop-blur-lg": scrolled,
          "border-b   backdrop-blur-lg": scrolled,
          "border-b ": selectedLayout,
        }
      )}
    >
      <div className="flex h-[79px] items-center justify-between px-4">
        {user?.role !== UserRole.SUPER_ADMIN && (
          <div>
            <Popover open={teamOpen} onOpenChange={setteamOpen}>
              <PopoverTrigger asChild>
                <div
                  aria-expanded={teamOpen}
                  className="w-[200px] justify-between overflow-hidden px-4 py-2 border border-gray-300 rounded-md flex items-center cursor-pointer"
                >
                  <span className="truncate">
                    {selectedTeamName || "Select team"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandEmpty>No team found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {teams?.map((team) => (
                        <CommandItem
                          key={team?.teamId}
                          value={team?.teamId}
                          onSelect={(currentValue) => {
                            setSelectedteam(currentValue);
                            setteamOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedteam === team?.teamId
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {team?.team.name}
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
                          userId={user?.id || ""}
                        />
                      </CommandItem>
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
        <div className="mr-4 hidden space-x-2 md:flex md:items-center md:justify-center">
          <InviteUserForm
            trigger={
              <Button className="rounded text-white font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] ">
                Invite
              </Button>
            }
            teamId={selectedteam || ""}
            teamName={selectedTeamName || ""}
          />
          <ModeToggle />
          {user ? <UserAccountNav userData={user} /> : <UserNav />}
        </div>
      </div>
    </div>
  );
};

export default Header;
