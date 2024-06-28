"use client";

import { createWebhook } from "@/actions/webhooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {} from "@/components/ui/dropdown-menu";
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
import MultipleSelector, { type Option } from "@/components/ui/multi-dropdown";
import { toast } from "@/components/ui/use-toast";
import { EventType } from "@prisma/client";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  endpoint: z.string().url(),
  eventTypes: z.array(optionSchema).min(1),
});

const EventTypes: Option[] = [
  { label: "form.submission", value: EventType.FORM_SUBMISSION },
  { label: "Others", value: EventType.OTHER },
];

export function CreateWebhookButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpoint: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const eventTypes = values.eventTypes.map(
      (option) => option.value
    ) as EventType[];
    const newWebhook = await createWebhook({
      ...values,
      userId: userId,
      eventTypes: eventTypes,
    });
    toast({
      title: "Webhook created",
      description: "Your webhook has been created.",
    });
    setIsOpen(false);
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded mt-12 md:mt-0 text-white font-bold  bg-gradient-to-r from-[#0077B6] to-[#00BCD4] ">
          Create Webhook
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Webhook</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-6">
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://" />
                    </FormControl>
                    <FormDescription>
                      Enter the endpoint where you want to receive webhook
                      updates.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventTypes"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-1 flex flex-row items-center justify-center gap-4">
                      <FormControl>
                        <MultipleSelector
                          {...field}
                          defaultOptions={EventTypes}
                          placeholder="Select event type you want to receive..."
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              no results found.
                            </p>
                          }
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Select the event type that you want to receive webhook
                      updates for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <LoadingButton
                className="rounded w-[200px] text-white font-bold  bg-gradient-to-r from-[#0077B6] to-[#00BCD4]"
                loading={isLoading}
                type="submit"
                disabled={isLoading || !form.formState.isDirty}
              >
                Create webhook
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
