"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { createUser } from "@/actions/users";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { userSignUpSchema } from "@/lib/validations/auth";
import { LoadingButton } from "./ui/loading-button";
import { PasswordInput } from "./ui/password-input";
import { PhoneInput } from "./ui/phone-input";

type FormData = z.infer<typeof userSignUpSchema>;

export function UserSignUpForm({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      accessToken: token,
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    console.log(data);
    try {
      const response = await createUser(data);

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

      router.push("/onboarding");
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
    <div className={cn("grid gap-6")}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Register</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email to get started
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Email" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormControl className="w-full gap-2">
                  <PhoneInput {...field} placeholder="Whatsapp Number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput {...field} placeholder="Password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput {...field} placeholder="Confirm Password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton
            type="submit"
            className="rounded text-white w-full font-semibold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] "
            disabled={isLoading}
            loading={isLoading}
          >
            Sign up
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
