"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { createUser } from "@/actions/users";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { userSignUpSchema } from "@/lib/validations/auth";

interface UserSignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userSignUpSchema>;

export function UserSignUpForm({ className, ...props }: UserSignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSignUpSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const response = await createUser(data);
      console.log(response);
      if (!response) {
        toast({
          title: "Sign Up Error",
          description: response,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (response.status === "error") {
        toast({
          title: "Sign Up Error",
          description: response.error,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Sign Up Successful",
        description: "Account created successfully.",
      });

      // Optionally, you can automatically sign in the user after sign-up
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResult?.error) {
        toast({
          title: "Sign In Error",
          description: signInResult.error,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      router.push("/onboarding"); // Redirect to a welcome page or similar after sign-up
    } catch (error) {
      console.log(error);
      toast({
        title: "Sign Up Error",
        description: "An error occurred during sign-up.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Name"
              type="text"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">
                {errors.name.message?.toString()}
              </p>
            )}
          </div>
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
            <Label className="sr-only" htmlFor="name">
              Access Token
            </Label>
            <Input
              id="name"
              placeholder="Access Token"
              type="text"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              {...register("accessToken")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">
                {errors.accessToken?.message?.toString()}
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
              autoComplete="new-password"
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
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="confirmPassword">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              placeholder="Confirm Password"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            {errors?.confirmPassword && (
              <p className="px-1 text-xs text-red-600">
                {errors.confirmPassword.message?.toString()}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={cn(
              buttonVariants(),
              "text-white font-bold mt-2 bg-gradient-to-r from-[#0077B6] to-[#00BCD4]"
            )}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up with Email
          </button>
        </div>
      </form>
    </div>
  );
}
