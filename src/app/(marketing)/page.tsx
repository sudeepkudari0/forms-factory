"use client";

import { getCurrentUser } from "@/lib/session";
import type { User } from "next-auth";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import heroDark from "../../../public/hero-dark.svg";
import hero from "../../../public/hero.svg";
export default function IndexPage() {
  const [user, setUser] = useState<User | null>(null);
  const { theme } = useTheme();
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
      }
    };

    fetchUser();
  });
  return (
    <>
      {
        <section className="space-y-6 pb-8 md:pb-12">
          <div className="container flex max-w-5xl flex-col items-center text-center">
            <div className="overflow-hidden pb-5 md:h-[500px] md:w-[700px]">
              {theme === "dark" ? (
                <Image
                  src={heroDark}
                  alt="Hero"
                  width={1000}
                  height={1000}
                  className="h-full w-full"
                />
              ) : (
                <Image
                  src={hero}
                  alt="Hero"
                  width={1000}
                  height={1000}
                  className="h-full w-full"
                />
              )}
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <Link
                href="/onboarding"
                className={"rounded-xl bg-[#6d5cea] text-white px-6 py-2"}
              >
                {user ? "Dashboard" : "Login"}
              </Link>
            </div>
          </div>
        </section>
      }
    </>
  );
}
