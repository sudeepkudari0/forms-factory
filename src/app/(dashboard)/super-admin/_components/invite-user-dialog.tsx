"use client";
import { inviteUser } from "@/actions/users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().min(2, { message: "Email is required" }),
});

type formSchema = z.infer<typeof formSchema>;

export const InviteUserForm = ({
  trigger,
}: {
  trigger: React.ReactElement;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: formSchema) {
    console.log(values);
    setIsLoading(true);
    const data = await inviteUser({
      ...values,
    });
    console.log(data);
    toast({
      title: "Invitation sent",
      description: "Your invitation has been created.",
    });
    setIsOpen(false);
    setIsLoading(false);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        {React.cloneElement(trigger, {
          onClick: () => setIsOpen(true),
        })}
      </DialogTrigger>
      <DialogContent className="rounded font-sans sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Users</DialogTitle>
          <DialogDescription>
            Invite user to join by entering their email address below. An
            invitation mail will be sent to the provided email.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton
                type="submit"
                className="rounded text-white mt-2 font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] "
                disabled={isLoading}
                loading={isLoading}
              >
                Send
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
