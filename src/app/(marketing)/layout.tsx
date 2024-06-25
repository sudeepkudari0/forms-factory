"use client";
import { Footer } from "@/components/layout/footer";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <Fade cascade damping={0.1} triggerOnce={true}>
      <div className="flex min-h-screen flex-col">
        <header className="z-40">
          <div className="sticky top-0 flex items-center justify-between py-4 pl-0 text-xl md:py-6 md:pl-[40px]">
            <Link href="/">
              <Image
                src={"/logo.png"}
                alt="Logo"
                width={1000}
                height={1000}
                className={cn("h-[40px] w-[50px] md:h-[100px] md:w-[130px]")}
              />
            </Link>
            <div className="flex text-sm md:text-lg items-center gap-4 font-mono px-4 md:px-10">
              <Link href={"#"}>About</Link>
              <Link href={"#"}>Services</Link>
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
