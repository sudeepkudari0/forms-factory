"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {} from "@/components/ui/card";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { FormError } from "@/components/ui/error";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { PasswordInput } from "@/components/ui/password-input";
import { FormSuccess } from "@/components/ui/success";
import { DialogContent } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { resetPassword } from "./action";

const formSchema = z.object({
  email: z.string(),
  password: z
    .string()
    .min(6, {
      message:
        "Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special case character.",
    })
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/,
      "Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special case character."
    ),
  confirmPassword: z.string().min(6, {
    message: "This field has to be filled.",
  }),
});

export function NewPasswordDialog({
  email,
  isPasswordDialogOpen,
  setIsPasswordDialogOpen,
}: {
  email: string;
  isPasswordDialogOpen: boolean;
  setIsPasswordDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      password: "",
      confirmPassword: "",
    },
  });

  function validatePassword(password: string) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;
    if (regex.test(password)) {
      return true;
    }
    return false;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSuccess("");
    setError("");

    const { password, confirmPassword } = values;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(() => {
      resetPassword(email, password).then((data) => {
        setError(data?.error);
        if (data?.success) {
          setSuccess("Password changed successfully!");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
          form.reset();
        }
      });
    });
  }

  return (
    <Dialog
      open={isPasswordDialogOpen}
      onOpenChange={(open) => {
        setIsPasswordDialogOpen(open);
        form.reset();
      }}
    >
      <DialogContent className="mx-auto grid w-[400px] rounded-md gap-6 bg-background p-4">
        <DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-2">
            <Image
              loading="lazy"
              src="/favicon.ico"
              width={1000}
              height={100}
              alt="Logo"
              className="h-auto w-[50px] rounded"
            />
            <h1 className="text-lg font-bold">Reset Password</h1>
          </div>{" "}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <>
                      <PasswordInput
                        placeholder="Password"
                        {...field}
                        inputClassName="peer block w-full border-2 bg-transparent focus:outline-none focus:ring-3 appearance-none text-sm outline-none placeholder:text-zinc-500 dark:bg-zinc-950"
                      />
                      {!validatePassword(field.value) && (
                        <p className="mt-2 text-sm text-gray-600">
                          Please enter a password that meets the below criteria.
                        </p>
                      )}
                      <ul className="">
                        <li
                          className={`text-sm ${
                            field.value.length >= 6
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {field.value.length >= 6 ? "✓" : "✕"} At least 6
                          characters
                        </li>
                        <li
                          className={`text-sm ${
                            /[a-z]/.test(field.value)
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {/[a-z]/.test(field.value) ? "✓" : "✕"} Contains a
                          lowercase letter
                        </li>
                        <li
                          className={`text-sm ${
                            /[A-Z]/.test(field.value)
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {/[A-Z]/.test(field.value) ? "✓" : "✕"} Contains an
                          uppercase letter
                        </li>
                        <li
                          className={`text-sm ${
                            /\d/.test(field.value)
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {/\d/.test(field.value) ? "✓" : "✕"} Contains a number
                        </li>
                        <li
                          className={`text-sm ${
                            /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
                              field.value
                            )
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
                            field.value
                          )
                            ? "✓"
                            : "✕"}{" "}
                          Contains a special character
                        </li>
                      </ul>
                    </>
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm Password"
                      {...field}
                      inputClassName="peer block w-full border-2 bg-transparent focus:outline-none focus:ring-3 appearance-none text-sm outline-none placeholder:text-zinc-500 dark:bg-zinc-950"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormError message={error} />
            <FormSuccess message={success} />

            <LoadingButton
              type="submit"
              loading={isPending}
              className="rounded w-full text-sm text-white bg-gradient-to-r from-[#0077B6] to-[#00BCD4]"
            >
              Submit
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
