import { GoogleSignInButton } from "@/components/google-signin-button";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaHouse } from "react-icons/fa6";

export const metadata = {
  title: "Login",
  description: "Login to get started.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { nextUrl?: string };
}) {
  const user = await getCurrentUser();
  const nextUrl = searchParams?.nextUrl || "/onboarding";
  if (user) {
    return redirect(nextUrl);
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 md:flex-row h-screen">
      <div className="hidden md:block absolute top-10 left-10 bg-zinc-200 shadow-md p-1 rounded-full">
        <Link href={"/"} className="cursor-pointer">
          <FaHouse className="h-6 w-6 shadow-lg" />
        </Link>
      </div>
      <div className="bg-background p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to Form Factory
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in with your Google account to get started
            </p>
          </div>
          <GoogleSignInButton />
          <p className="text-muted-foreground px-8 text-center text-sm">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/policy"
              className="hover:text-brand underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
