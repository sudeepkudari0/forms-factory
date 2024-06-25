"use client";

import CreateteamForm from "@/app/(dashboard)/[teamName]/_components/create-team-form";
import { Button } from "@/components/ui/button";
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
import type { Teams, UserTeam } from "@prisma/client";
import Cookies from "js-cookie";
import { Check, ChevronsUpDown, PlusCircleIcon } from "lucide-react";
import type { User } from "next-auth";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "../mode-toggle";
import { UserAccountNav } from "../user-account-nav";
import { UserNav } from "../user-nav";

type teams = UserTeam & {
  team: Teams;
};

const Header = ({ user, teams }: { user?: User; teams?: teams[] }) => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const [selectedteam, setSelectedteam] = useState<string | null>(null);
  const [teamOpen, setteamOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initialTeam = Cookies.get("tid") || "";
    setSelectedteam(initialTeam);
  }, []);

  useEffect(() => {
    if (selectedteam) {
      const selectedTeamData = teams?.find((team) => team.id === selectedteam);
      if (selectedTeamData) {
        const tname = selectedTeamData.team.name.replace(/\s+/g, "-");
        router.refresh();
        router.push(`/${tname}`);
        Cookies.set("tid", selectedteam, { path: "/" });
        Cookies.set("tname", tname, { path: "/" });
      }
    }
  }, [selectedteam, teams, router]);

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
        <div>
          <Popover open={teamOpen} onOpenChange={setteamOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={teamOpen}
                className="w-[200px] justify-between"
              >
                {selectedteam
                  ? teams?.find((team) => team.id === selectedteam)?.team.name
                  : "Select team"}
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
                          setSelectedteam(currentValue);
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
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row items-center justify-center space-x-3 md:hidden"
          >
            <span className="h-7 w-7 rounded-lg" />
            <span className="flex text-xl font-bold ">Logo</span>
          </Link>
        </div>
        <div className="mr-4 hidden space-x-2 md:flex md:items-center md:justify-center">
          <ModeToggle />
          {user ? <UserAccountNav userData={user} /> : <UserNav />}
        </div>
      </div>
    </div>
  );
};

export default Header;
