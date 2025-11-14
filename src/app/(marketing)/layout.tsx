"use client";

import { Footer } from "@/components/layout/footer";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const { theme } = useTheme();
  return (
    <Fade cascade damping={0.1} triggerOnce={true}>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <main className="flex-1">{children}</main>
      </div>
    </Fade>
  );
}
