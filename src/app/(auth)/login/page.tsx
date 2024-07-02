import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAuthForm } from "@/components/user-login-form";
import { UserSignUpForm } from "@/components/user-signup-form";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaHouse } from "react-icons/fa6";

export const metadata = {
  title: "Login",
  description: "Login to get started.",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    return redirect("/onboarding");
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 md:flex-row h-screen">
      <div className="hidden md:block absolute top-10 left-10 bg-zinc-200 shadow-md p-1 rounded-full">
        <Link href={"/"} className="cursor-pointer">
          <FaHouse className="h-6 w-6 shadow-lg" />
        </Link>
      </div>
      <div className="bg-background p-4 rounded-md">
        <Tabs
          defaultValue="login"
          className="flex flex-col items-center max-w-2xl bg-background"
        >
          <TabsList className="flex w-auto">
            <TabsTrigger
              value="login"
              className="min-w-[100px] md:min-w-[200px] "
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="min-w-[100px] md:min-w-[200px]"
            >
              Signup
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="flex">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email to sign in to your account
                </p>
              </div>
              <UserAuthForm />
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
          </TabsContent>
          <TabsContent value="signup" className="flex">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Register
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email to get started
                </p>
              </div>
              <UserSignUpForm />
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
