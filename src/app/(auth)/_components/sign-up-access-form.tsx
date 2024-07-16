"use client";

import { checkUserInvitation } from "@/actions/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { FormError } from "@/components/ui/error";
import { LoadingButton } from "@/components/ui/loading-button";
import { PasswordInput } from "@/components/ui/password-input";
import { FormSuccess } from "@/components/ui/success";
import { UserSignUpForm } from "@/components/user-signup-form";
import { useState } from "react";

export const SignUpAccessForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessCard, setAccessCard] = useState<boolean>(true);
  const [token, setToken] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!token) {
      setIsLoading(false);
      setError("Please enter an access token.");
      return;
    }
    const data = await checkUserInvitation(token);
    if (data.success) {
      setAccessCard(false);
      setSuccess(data.message);
    }

    setError(data.message);

    setIsLoading(false);
  };

  return (
    <>
      {accessCard ? (
        <Card>
          <CardContent className="rounded">
            <CardHeader className="pl-0">
              <CardTitle>Access Token</CardTitle>
              <CardDescription>Enter your signup access token.</CardDescription>
            </CardHeader>
            <div className="w-full">
              <PasswordInput
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Access token"
                inputClassName="peer block w-full border-2 bg-transparent focus:outline-none focus:ring-3 appearance-none text-sm outline-none placeholder:text-zinc-500 dark:bg-zinc-950"
              />
              <div className="mt-2">
                <FormSuccess message={success} />
                <FormError message={error} />
              </div>
            </div>
            <DialogFooter>
              <LoadingButton
                type="submit"
                onClick={handleSubmit}
                className="rounded text-white mt-1 w-full font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] "
                disabled={isLoading}
                loading={isLoading}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </CardContent>
        </Card>
      ) : (
        <UserSignUpForm token={token} />
      )}
    </>
  );
};
