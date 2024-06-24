"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SocialLinks } from "../social-links"

export function Footer() {
  const pathname = usePathname()

  if (pathname.includes("pitch")) {
    return null
  }

  return (
    <footer className="border-t-[1px] border-border px-4 md:px-6 pt-10 md:pt-16 overflow-hidden max-h-[900px]">
      <div className="container">
        <div className="flex justify-between items-center border-border border-b-[1px] pb-10 md:pb-16 mb-12">
          <Link href="/">
            <div className="bg-[url('/logo-2.jpg')] h-[40px] w-[150px] bg-contain bg-center bg-no-repeat items-center justify-center space-x-3  md:h-[100px] md:w-[300px] dark:bg-[url('/logo-2-dark.png')]" />
          </Link>
          <span className="font-normal md:text-2xl text-right">
            Gateway to Cutting Edge Data Solutions
          </span>
        </div>

        <div className="flex flex-col md:flex-row w-full">
          <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:w-6/12 justify-between leading-8">
            <div>
              <ul>
                <li className="transition-colors text-[#878787]">
                  <Link href="/support">Support</Link>
                </li>
                <li className="transition-colors text-[#878787]">
                  <Link href="/policy">Privacy policy</Link>
                </li>
                <li className="transition-colors text-[#878787]">
                  <Link href="/terms">Terms and Conditions</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:w-6/12 flex mt-8 md:mt-0 md:justify-end">
            <div className="flex justify-between md:items-end flex-col space-y-14">
              <div className="flex items-center">
                {/* <GithubStars /> */}
                <SocialLinks />
              </div>
              <div className="md:mr-0 mr-auto">{/* <StatusWidget /> */}</div>
            </div>
          </div>
        </div>
      </div>

      <h5 className="text-[500px] leading-none text-center pointer-events-none text-white dark:text-black">
        TrDC
      </h5>
    </footer>
  )
}
