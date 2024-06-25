"use client";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { userLoginSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
// import { createSuperUser } from "@/actions/users"

interface UserLoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userLoginSchema>;

// const handleClick = async () => {
//   const data = await createSuperUser({
//     email: "ashdhar@thinkroman.com",
//     password: "Superadmin@#123",
//     name: "Dr Dhar",
//   });
//   console.log(data);
// };

export function UserAuthForm({ className, ...props }: UserLoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userLoginSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const callbackError = searchParams?.get("error");

    if (callbackError === "OAuthAccountNotLinked") {
      toast({
        title: "Account already exists.",
        description: "Whoops, there may already be an account with that email",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    const signInResult = await signIn("credentials", {
      ...data,
      redirect: false,
      callbackUrl: searchParams?.get("from") || "/onboarding",
    });

    if (signInResult?.error) {
      setIsLoading(false);
      toast({
        title: "Incorrect Email or Password",
        description:
          "Whoops, You may have entered an incorrect email or password",
        variant: "destructive",
      });
      return;
    }
    if (signInResult?.ok) {
      window.location.href = searchParams?.get("from") || "/onboarding";
      return;
    }
    setIsLoading(false);

    return;
  }

  return (
    <div className={cn("grid gap-6 ", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Email"
              type="text"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message?.toString()}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message?.toString()}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={cn(
              buttonVariants(),
              "text-white font-bold mt-2 bg-gradient-to-r from-[#0077B6] to-[#00BCD4] "
            )}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </button>
          {/* <Button onClick={handleClick}>Click me</Button> */}
        </div>
      </form>
    </div>
  );
}
