"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { LoadingButton } from "./ui/loading-button";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/onboarding",
        redirect: true,
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      onClick={handleGoogleSignIn}
      loading={isLoading}
      disabled={isLoading}
      className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 flex items-center justify-center gap-3"
    >
      <FcGoogle className="h-5 w-5" />
      {isLoading ? "Signing in..." : "Continue with Google"}
    </LoadingButton>
  );
}
