"use client";

import {} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import "react-phone-input-2/lib/style.css";
import {
  deleteExistingProfilePicture,
  getPresignedUrl,
  profileUpdate,
  updateProfilePicture,
} from "@/actions/users";
import { cn } from "@/lib/utils";
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
  const [uploading, setUploading] = useState(false);
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

  const { isDirty } = form.formState;

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

  const uploadToS3PresignedUrl = async (
    file: any,
    presignedUrl: string | URL | Request,
    mimeType: any
  ) => {
    try {
      const response = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": mimeType,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file to S3");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const updateDatabaseWithImageUrl = async (imageUrl: string) => {
    await deleteExistingProfilePicture();
    await updateProfilePicture(imageUrl);
    queryClient.invalidateQueries({ queryKey: ["userData"] });
  };

  const uploadImageToS3 = async (pickedImage: File) => {
    setUploading(true);
    const file = pickedImage;
    try {
      const fileName = file.name;
      const presignedData = await getPresignedUrl(fileName);
      const presignedUrl = presignedData.presignedUrl;
      await uploadToS3PresignedUrl(file, presignedUrl, file.type);

      const publicUrl = presignedData.publicUrl;

      await updateDatabaseWithImageUrl(publicUrl);
    } catch (error) {
      console.error(error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center p-1 w-full">
        <UserAvatar user={user} className="h-24 w-24 cursor-pointer" />
        <LoadingButton
          loading={uploading}
          variant={"ghost"}
          className="text-sm mt-4 text-muted-foreground cursor-pointer hover:text-black  dark:text-white hover:bg-gray-100 px-1 rounded-md dark:hover:bg-zinc-800"
        >
          Change Profile Picture
        </LoadingButton>
        <Input
          type="file"
          onChange={(e: any) => uploadImageToS3(e.target.files[0])}
          className=" text-sm p-1 absolute w-[200px] mt-1 -top-10 -left-[100px] opacity-0 rounded cursor-pointer text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 z-50">
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
                    {...field}
                    defaultCountry="IN"
                    placeholder=""
                    className={cn(" gap-2 font-semibold text-sm text-zinc-400")}
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
              disabled={isLoading || !isDirty}
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
