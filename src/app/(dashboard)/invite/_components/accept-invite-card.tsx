"use client";

import { invitationAccept } from "@/actions/team";
import { getCurrentUserDetails } from "@/actions/users";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "@/components/ui/use-toast";
import { UserAccountNav } from "@/components/user-account-nav";
import type { Invitation, User } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../../../../../public/LOGO.svg";

export const AcceptInviteCard = ({
  data,
  teamName,
}: {
  data: Invitation;
  teamName: string;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getUser = async () => {
      const userData = await getCurrentUserDetails();
      if (userData) {
        setUser(userData);
      }
    };
    getUser();
  }, []);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const status = await invitationAccept(data);
      if (status?.success) {
        toast({
          title: status?.success,
          description: status?.message,
        });

        window.location.href = "/onboarding";
      }

      if (status?.error) {
        toast({
          title: status?.error,
          description: status?.message,
        });
      }
    } catch (error) {
      console.error("Error accepting invite:", error);
      toast({
        title: "Error",
        description: "An error occurred while accepting the invite.",
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="absolute flex flex-row items-center gap-4 top-5 right-5">
        <ModeToggle />
        {user && <UserAccountNav userData={user} />}
      </div>
      <Card className="w-[350px]">
        <CardHeader className="flex items-center">
          <Image
            loading="lazy"
            src={logo}
            width={1000}
            height={100}
            alt="Logo"
            className="h-auto w-12 rounded"
          />
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{teamName}</h2>
            <p className="text-muted-foreground">
              Join our team to create and manage forms.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <LoadingButton
            onClick={handleAccept}
            loading={isLoading}
            className="rounded w-full text-white text-lg bg-gradient-to-r from-[#0077B6] to-[#00BCD4] hover:text-white"
          >
            Accept
          </LoadingButton>
        </CardFooter>
      </Card>
    </>
  );
};
