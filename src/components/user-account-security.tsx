"use client";

import { profilePasswordUpdate } from "@/actions/users";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingButton } from "./ui/loading-button";
import { toast } from "./ui/use-toast";

const securitySchema = z
  .object({
    userId: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type securitySchema = z.infer<typeof securitySchema>;

export function SecurityForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<securitySchema>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      userId: user.id,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: securitySchema) => {
    setIsLoading(true);
    await profilePasswordUpdate({ ...values });
    toast({
      title: "Password Updated",
      description: "Your password has been updated.",
    });
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
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
                <Input type="password" {...field} className="mb-2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex items-end justify-end">
          <LoadingButton
            type="submit"
            className="rounded text-white font-bold mt-4 bg-gradient-to-r from-[#0077B6] to-[#00BCD4] "
            disabled={isLoading}
            loading={isLoading}
          >
            Update
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
