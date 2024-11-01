"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormError } from "@/components/ui/error";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { FormSuccess } from "@/components/ui/success";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forgotPassword } from "./action";
import { NewPasswordDialog } from "./new-password-dialog";
import { OtpVerificationDialog } from "./opt-verification-dialog";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export function ForgotPasswordForm() {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<boolean | undefined>();
  const [isOtpVerificationOpen, setIsOtpVerificationOpen] =
    React.useState(false);
  const [newPasswordDialog, setNewPasswordDialog] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    startTransition(() => {
      forgotPassword(values.email).then((data) => {
        if (data.success) {
          setSuccess(true);
          setIsOtpVerificationOpen(true);
        } else {
          setError(data.error);
        }
      });
    });
  }

  return (
    <>
      {newPasswordDialog ? (
        <NewPasswordDialog
          isPasswordDialogOpen={newPasswordDialog}
          setIsPasswordDialogOpen={setNewPasswordDialog}
          email={form.getValues("email")}
        />
      ) : (
        <Card className="mx-auto grid w-[350px]">
          <CardHeader>
            <div className="flex flex-col items-center justify-center space-y-2">
              <Image
                loading="lazy"
                src="/favicon.ico"
                width={1000}
                height={100}
                alt="Logo"
                className="h-auto w-[50px] rounded"
              />
              <h1 className="text-lg font-bold">Forgot Password</h1>
            </div>{" "}
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormError message={error} />
                <FormSuccess
                  message={success ? "OTP sent successfully." : ""}
                />
                <LoadingButton
                  type="submit"
                  loading={isPending}
                  className="w-full"
                >
                  Submit
                </LoadingButton>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      <OtpVerificationDialog
        isOtpDialogOpen={isOtpVerificationOpen}
        setIsOtpDialogOpen={setIsOtpVerificationOpen}
        setNewPasswordDialog={setNewPasswordDialog}
        email={form.getValues("email")}
      />
    </>
  );
}
