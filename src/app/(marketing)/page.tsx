import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import hero from "../../../public/hero-image-cropped.svg";
export default async function IndexPage() {
  const user = await getCurrentUser();
  return (
    <>
      {
        <section className="space-y-6 pb-8 md:pb-12">
          <div className="container flex max-w-5xl flex-col items-center text-center">
            <div className="overflow-hidden pb-5 md:h-[500px] md:w-[700px]">
              <Image
                src={hero}
                alt="Hero"
                width={1000}
                height={1000}
                className="h-full w-full"
              />
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
