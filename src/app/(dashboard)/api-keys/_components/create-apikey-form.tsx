"use client";

import { createApiKey } from "@/actions/api-key";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, CopyIcon } from "lucide-react"; // Import CheckIcon
import type { User } from "next-auth";
import { useState } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const apiKeySchema = z.object({
  name: z.string().min(2).max(50),
});

const CreateApiKeyForm = ({
  user,
  trigger,
}: {
  user: User;
  trigger: React.ReactElement;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false); // State to manage the icon

  const { toast } = useToast();
  const form = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof apiKeySchema>) {
    setIsLoading(true);
    try {
      const { apiKey } = await createApiKey({
        ...values,
        userId: user.id || "",
      });
      setGeneratedKey(apiKey);
      toast({
        title: "API Key created",
        description: "Your API key has been created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the API key.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true); // Set copied state to true
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000); // Revert back to CopyIcon after 2 seconds
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        form.reset();
        setGeneratedKey(null);
      }}
    >
      <DialogTrigger asChild>
        {React.cloneElement(trigger, {
          onClick: () => setIsOpen(true),
        })}
      </DialogTrigger>
      <DialogContent className="sm:w-[380px]">
        <DialogHeader>
          <DialogTitle>
            {!generatedKey
              ? "Create API Key"
              : "Your API key has been created "}
          </DialogTitle>
          <DialogDescription>
            {generatedKey
              ? "Copy your new API key and keep it safe!"
              : " Enter the details to create a new API key."}
          </DialogDescription>
        </DialogHeader>
        {generatedKey ? (
          <div className="w-full space-y-2">
            <div className="flex items-center space-x-2 w-full">
              <Input value={generatedKey} className="w-[280px]" readOnly />
              <Button
                onClick={() => copyToClipboard(generatedKey)}
                variant="ghost"
              >
                {copied ? (
                  <CheckIcon className="w-4 h-4 text-green-500 transition-all duration-300" />
                ) : (
                  <CopyIcon className="w-4 h-4 transition-all duration-300" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="border-0">
                <CardContent className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your API key.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <LoadingButton
                    className="rounded text-white font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4]"
                    loading={isLoading}
                    type="submit"
                  >
                    Create API Key
                  </LoadingButton>
                </CardContent>
              </Card>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateApiKeyForm;
