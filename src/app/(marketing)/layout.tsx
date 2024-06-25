"use client";

import { Footer } from "@/components/layout/footer";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import logodark from "../../../public/hero-dark.svg";
import logo from "../../../public/hero.svg";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const { theme } = useTheme();
  return (
    <Fade cascade damping={0.1} triggerOnce={true}>
      <div className="flex min-h-screen flex-col">
        <header className="bg-none">
          <div className="sticky bg-none top-0 flex items-center justify-between py-4 pl-0 text-xl md:py-6 md:pl-[40px]">
            <Link href="/">
              {theme === "dark" ? (
                <Image
                  src={logodark}
                  alt="Logo"
                  width={1000}
                  height={1000}
                  className={cn("h-[40px] w-[50px] md:h-[80px] md:w-[130px]")}
                />
              ) : (
                <Image
                  src={logo}
                  alt="Logo"
                  width={1000}
                  height={1000}
                  className={cn("h-[40px] w-[50px] md:h-[80px] md:w-[130px]")}
                />
              )}
            </Link>
            <div className="flex text-sm md:text-lg items-center gap-4 font-mono px-4 md:px-10">
              <Link href={"/login"}>Register</Link>
              <ModeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </Fade>
  );
}
