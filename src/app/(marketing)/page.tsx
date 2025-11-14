import { LogoAnimation } from "@/components/logo-animation";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
export default async function IndexPage() {
  const user = await getCurrentUser();
  return (
    <>
      {
        <section className="space-y-6 pb-8 md:pb-12 flex flex-col items-center justify-center h-screen">
          <div className="container flex max-w-5xl flex-col items-center text-center">
            <div className="overflow-hidden md:pb-10 md:h-[380px] md:w-[700px]">
              <LogoAnimation />
            </div>
            <div>
              <h1 className="text-3xl font-Nunito pb-8 tracking-wide text-[#f01212] font-bold md:text-7xl">
                Forms Factory
              </h1>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <Link
                href={user ? "/onboarding" : "/login"}
                className={"rounded-xl bg-[#6d5cea] text-white px-6 py-2"}
              >
                {user ? "Go to Dashboard" : "Get Started"}
              </Link>
            </div>
          </div>
        </section>
      }
    </>
  );
}
