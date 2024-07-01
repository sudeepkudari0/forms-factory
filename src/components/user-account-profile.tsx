"use client";

import {
  Dialog,
  DialogContent,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import * as z from "zod";
import "react-phone-input-2/lib/style.css";
import { profileUpdate } from "@/actions/users";
import { UploadDropzone } from "@/lib/uploadthing";
import type { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {} from "./ui/avatar";
import { LoadingButton } from "./ui/loading-button";
import { toast } from "./ui/use-toast";
import { UserAvatar } from "./user-avatar";

const userSchema = z.object({
  userId: z.string(),
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email"),
  whatsapp: z.string(),
  image: z.string(),
});

export type userSchema = z.infer<typeof userSchema>;

export const ProfileForm = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<User>(user);
  const queryClient = useQueryClient();

  const form = useForm<userSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userId: user.id,
      name: user.name || "",
      email: user.email || "",
      whatsapp: user.whatsapp || "",
      image: user.image || "",
    },
  });

  useEffect(() => {
    form.reset({
      userId: user.id,
      name: user.name || "",
      image: user.image || "",
      email: user.email || "",
      whatsapp: user.whatsapp || "",
    });
  }, [form, user]);

  async function onSubmit(values: userSchema) {
    setIsLoading(true);
    const data = await profileUpdate({ ...values });
    if (data) {
      setUserData(data);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    }
    setIsLoading(false);
  }

  const handleAutoSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 z-50">
          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
              form.reset();
            }}
          >
            <DialogTrigger asChild>
              <div className="flex flex-col items-center p-4">
                <UserAvatar
                  user={userData}
                  className="h-24 w-24 cursor-pointer"
                />
                <p className="text-sm p-1 mt-4 rounded cursor-pointer text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700">
                  Change Profile Image{" "}
                </p>
              </div>
            </DialogTrigger>
            <DialogContent className="rounded sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload Image</DialogTitle>
              </DialogHeader>
              <UploadDropzone
                endpoint="fileUpload"
                config={{
                  mode: "auto",
                }}
                appearance={{
                  button: {
                    cursor: "pointer",
                    padding: "15px",
                    borderRadius: "4px",
                    fontSize: "15px",
                    color: "#fff",
                    backgroundColor: "#000",
                    border: "none",
                    outline: "none",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
                className="p-2"
                onClientUploadComplete={async (res) => {
                  if (res) {
                    form.setValue("image", res[0].url);
                    setUserData({ ...userData, image: res[0].url });
                    handleAutoSubmit();
                  }
                  setIsOpen(false);
                }}
                onUploadError={() => {
                  console.log("onUploadError");
                  setIsOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="z-[100]">Name</FormLabel>
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
    </div>
  );
};
