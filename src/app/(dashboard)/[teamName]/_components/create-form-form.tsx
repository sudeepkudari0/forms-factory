"use client";

import { addFormsToUser, createForm } from "@/actions/forms";
import { addFormsToteam } from "@/actions/team";
import { getCurrentUserDetails } from "@/actions/users";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  whatsapp: z.string().min(2).max(50),
  submitText: z.string().min(2).max(50),
});

type formSchema = z.infer<typeof formSchema>;

const CreateFormForm = ({
  trigger,
  userId,
  username,
  teamId,
  setRefetch,
  refetch,
}: {
  trigger: React.ReactElement;
  userId: string;
  username: string;
  teamId: string;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      whatsapp: "",
      submitText: "Submit",
    },
  });

  useEffect(() => {
    const getUserData = async () => {
      const data = await getCurrentUserDetails();
      if (data) {
        form.setValue("whatsapp", data.whatsapp || "");
      }
    };
    getUserData();
  }, [isOpen]);

  async function onSubmit(values: formSchema) {
    setIsLoading(true);
    const data = await createForm({
      ...values,
      userId: userId,
      username: username,
    });
    if (data) {
      await addFormsToUser({ userId, formIds: [data.id] });
      await addFormsToteam({ teamId, formIds: [data.id] });
    }
    setRefetch(!refetch);
    router.push(`/forms/${data.id}/edit`);
    toast({
      title: "Form created",
      description: "Your form has been created.",
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
      <DialogContent className="rounded sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Basic information</DialogTitle>
          <DialogDescription>
            Enter the basic form information. After creating the form you will
            be redirected to create the forms content.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>The title of your form.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Give the user some context about the form..."
                      className="resize-none"
                      maxLength={512}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A description of your form. This is optional.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whatsapp Number</FormLabel>
                  <FormControl className="">
                    <PhoneInput {...field} className="gap-2 w-full" />
                  </FormControl>
                  <FormDescription>
                    WhatsApp number to receive notifications for each form
                    submission.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="submitText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Submit label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The text displayed on the submit button.
                  </FormDescription>
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

export default CreateFormForm;
