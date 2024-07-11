"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormError } from "@/components/ui/error";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoadingButton } from "@/components/ui/loading-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { VerifyOtp, forgotPassword } from "./action";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function OtpVerificationDialog({
  isOtpDialogOpen,
  setIsOtpDialogOpen,
  setNewPasswordDialog,
  email,
}: {
  isOtpDialogOpen: boolean;
  setIsOtpDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewPasswordDialog: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
}) {
  const [codeResent, setCodeResent] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function resendCode() {
    setCodeResent(true);
    await forgotPassword(email);
    setCodeResent(false);
  }

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const data = await VerifyOtp(email, values.pin);
    if (data?.error === "Invalid OTP") {
      setIsLoading(false);
      return setError("Invalid OTP");
    }

    if (data?.success) {
      setIsOtpDialogOpen(false);
      setNewPasswordDialog(true);
      // const setLogin = await signIn(email, password);
      // if (setLogin?.success === "Logged in successfully!") {
      //   setIsOtpDialogOpen(false);
      //   router.push("/onboarding");
      // }
      // setIsLoading(false);
    }
  }
  return (
    <>
      <Dialog
        open={isOtpDialogOpen}
        onOpenChange={(open) => {
          setIsOtpDialogOpen(open);
          form.reset();
        }}
      >
        <DialogContent className="rounded sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>OTP Verification</DialogTitle>
            <DialogDescription className="text-sm flex flex-col">
              Enter the verification code sent to your email address
              <span className="text-foreground font-semibold text-center pt-1">
                {email}
              </span>
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col items-center">
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <LoadingButton
                      loading={codeResent}
                      type="button"
                      variant={"ghost"}
                      onClick={() => resendCode()}
                    >
                      Resend Code
                    </LoadingButton>
                    <FormError message={error} />
                  </FormItem>
                )}
              />

              <LoadingButton
                type="submit"
                loading={isLoading}
                className="rounded w-full text-sm text-white bg-gradient-to-r from-[#0077B6] to-[#00BCD4]"
              >
                Submit
              </LoadingButton>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
