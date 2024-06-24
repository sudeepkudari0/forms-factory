"use client";

import { updateUser } from "@/actions/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { type User, UserStatus } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import * as z from "zod";
import "react-phone-input-2/lib/style.css";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const userSchema = z.object({
  userId: z.string(),
  name: z.string().min(2).max(50),
  email: z.string().email(),
  status: z.nativeEnum(UserStatus),
  whatsapp: z.string().min(10).max(15),
});

type userSchema = z.infer<typeof userSchema>;

const UpdateUserForm = ({
  trigger,
  user,
}: {
  trigger: React.ReactElement;
  user: User;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const form = useForm<userSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userId: user.id,
      name: user.name || "",
      email: user.email,
      status: user.userStatus,
      whatsapp: user.whatsapp || "",
    },
  });

  useEffect(() => {
    form.reset({
      userId: user.id,
      name: user.name || "",
      email: user.email,
      status: user.userStatus,
      whatsapp: user.whatsapp || "",
    });
  }, [form, user]);

  async function onSubmit(values: userSchema) {
    setIsLoading(true);
    const data = await updateUser({ ...values });
    if (data) {
      queryClient.invalidateQueries({ queryKey: ["filteredUsers"] });
    }
    toast({
      title: "User updated",
      description: `User ${data.name} has been updated.`,
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
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>
            Users are responsible for filling the forms!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} className="mb-2" />
                  </FormControl>
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
                  <FormControl>
                    <PhoneInput
                      enableSearch
                      autoFormat={false}
                      containerStyle={{
                        width: "100%",
                        border: "0px solid #ebeaea",
                        boxSizing: "border-box",
                        backgroundColor: "#ccc9c9",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                      buttonClass="border-none bg-white"
                      inputStyle={{
                        width: "100%",
                        color: "black",
                        border: "1px solid #ebeaea",
                        boxSizing: "border-box",
                        marginBottom: "8px",
                      }}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-1 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Status</FormLabel>
                    <FormDescription>
                      {"User Status Description "}
                    </FormDescription>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserStatus.ACTIVE}>
                        APPROVED
                      </SelectItem>
                      <SelectItem value={UserStatus.INACTIVE}>
                        INACTIVE
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                Update
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserForm;
