import type { Metadata } from "next";

import Link from "next/link";
import { FaHouse } from "react-icons/fa6";
import { ForgotPasswordForm } from "../_components/forgot-password";
export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center md:py-2">
      <div className="hidden md:block absolute top-20 left-10 bg-zinc-200 shadow-md p-1 rounded-full">
        <Link href={"/"} className="cursor-pointer">
          <FaHouse className="h-6 w-6 shadow-lg" />
        </Link>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
