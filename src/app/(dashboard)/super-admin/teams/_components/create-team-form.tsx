"use client";

import { createteam } from "@/actions/team";
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
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const teamSchema = z.object({
  name: z.string().min(2).max(50),
});

type teamSchema = z.infer<typeof teamSchema>;

const CreateteamForm = ({ trigger }: { trigger: React.ReactElement }) => {
  const _router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<teamSchema>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: teamSchema) {
    setIsLoading(true);
    await createteam({ ...values });
    toast({
      title: "team created",
      description: "Your team has been created.",
    });
    queryClient.invalidateQueries({ queryKey: ["teams"] });
    setIsLoading(false);
    setIsOpen(false);
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
      <DialogContent className="rounded sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>Description for team</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
                className="rounded text-white font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] "
                disabled={isLoading}
                loading={isLoading}
              >
                Create
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateteamForm;
