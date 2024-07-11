"use client";
import {} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingButton } from "./ui/loading-button";
// import { createSuperUser } from "@/actions/users"

// const handleClick = async () => {
//   const data = await createSuperUser({
//     email: "ashdhar@thinkroman.com",
//     password: "Superadmin@#123",
//     name: "Dr Dhar",
//   });
//   console.log(data);
// };

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});
export function UserAuthForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
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

  async function onSubmit(data: z.infer<typeof formSchema>) {
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
      window.location.href = searchParams?.get("nextUrl") || "/onboarding";
      return;
    }
    setIsLoading(false);

    return;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-zinc-400">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  className="peer block w-full border-2 bg-transparent focus:outline-none focus:ring-3 appearance-none text-sm outline-none placeholder:text-zinc-500 dark:bg-zinc-950"
                  {...field}
                />
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
              <FormLabel className=" block text-sm font-medium text-zinc-400">
                Password
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Password"
                  {...field}
                  inputClassName="peer block w-full border-2 bg-transparent focus:outline-none focus:ring-3 appearance-none text-sm outline-none placeholder:text-zinc-500 dark:bg-zinc-950"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="">
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="mb-2 text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <LoadingButton
            type="submit"
            loading={isLoading}
            className="rounded w-full text-sm text-white bg-gradient-to-r from-[#0077B6] to-[#00BCD4]"
          >
            Login
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
