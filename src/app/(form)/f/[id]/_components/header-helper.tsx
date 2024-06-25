"use client";
import { ModeToggle } from "@/components/mode-toggle";

export const HeaderHelper = () => {
  return (
    <div>
      <div className="absolute top-2 right-2 md:right-8 md:top-8">
        <ModeToggle />
      </div>
    </div>
  );
};
