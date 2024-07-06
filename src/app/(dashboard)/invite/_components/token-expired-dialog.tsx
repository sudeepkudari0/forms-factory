"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import logo from "../../../../../public/LOGO.svg";

export const TokenExpiredDialog = () => {
  return (
    <>
      <div className="absolute flex flex-row items-center gap-4 top-5 right-5">
        <ModeToggle />
      </div>
      <Card className="w-[350px]">
        <CardHeader className="flex items-center">
          <Image
            loading="lazy"
            src={logo}
            width={1000}
            height={100}
            alt="Logo"
            className="h-auto block w-14 rounded"
          />
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <h2 className="text-2xl font-bold">Link Expired</h2>
            <p className="text-muted-foreground">
              The invitation link has expired.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
