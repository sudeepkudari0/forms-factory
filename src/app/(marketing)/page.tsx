import AnimatedText from "@/components/color-changing-text"
import { getCurrentUser } from "@/lib/session"
import Link from "next/link"

export default async function IndexPage() {
  const user = await getCurrentUser()
  return (
    <>
      {
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-12">
          <div className="container flex max-w-5xl flex-col items-center gap-4 text-center">
            <h1 className="font-heading bg-gradient-to-r from-[#18dcff] from-30% to-[#1a3af1] bg-clip-text text-center text-3xl text-transparent sm:text-5xl md:text-8xl lg:text-8xl">
              <span>ThinkRoman</span>
              <br />
              <span>Data Center</span>
            </h1>
            <AnimatedText />
            <div className="flex flex-col gap-2 md:flex-row">
              <Link href="/onboarding" className={"rounded-xl bg-[#6d5cea] text-white px-6 py-2"}>
                {user ? "Dashboard" : "Login"}
              </Link>
            </div>
          </div>
        </section>
      }
    </>
  )
}
