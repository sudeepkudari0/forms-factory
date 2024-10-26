"use client";

import { createFormHeaders } from "@/actions/forms";
import { getPresignedUrl } from "@/actions/users";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Form as FormType } from "@prisma/client";
import { Loader2, UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "./ui/use-toast";
const formSchema = z.object({
  id: z.string().min(2).max(50),
  headerImage: z.string(),
  formHeader: z.string(),
  formDescription: z.string(),
  formFooter: z.string(),
});

type formSchema = z.infer<typeof formSchema>;

export const EditFormHeaders = ({ formData }: { formData: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (formData.headerImage) {
      setPreviewImage(formData.headerImage);
    }
  }, [formData.headerImage]);

  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: formData.id,
      headerImage: formData.headerImage || "",
      formHeader: formData.headerText || "",
      formDescription: formData.formDescription || "",
      formFooter: formData.footerText || "",
    },
  });

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewImage(undefined);
  };

  async function onSubmit(values: formSchema) {
    setIsLoading(true);
    await createFormHeaders({
      ...values,
    });
    toast({
      title: "Form Updated",
      description: "Your form has been updated.",
    });
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

  const uploadImageToS3 = async (pickedImage: File) => {
    setUploading(true);
    setImage(pickedImage);
    setPreviewImage(URL.createObjectURL(pickedImage));
    const file = pickedImage;
    try {
      const fileName = file.name;
      const presignedData = await getPresignedUrl(fileName);
      const presignedUrl = presignedData.presignedUrl;
      await uploadToS3PresignedUrl(file, presignedUrl, file.type);

      const publicUrl = presignedData.publicUrl;
      form.setValue("headerImage", publicUrl);
    } catch (error) {
      console.error(error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container my-8 max-w-3xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
          <FormField
            control={form.control}
            name="formHeader"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Header</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="The header of your form." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="formDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Give user some context about the form..."
                    className="resize-none"
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="formFooter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Footer</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="The footer of your form." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="headerImage"
            render={() => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 pt-2">
                  Header Image{" "}
                  {uploading && (
                    <Loader2 className={cn("h-4 w-4 animate-spin mr-2")} />
                  )}
                </FormLabel>
                <FormControl>
                  {previewImage ? (
                    <div className="relative border">
                      <Image
                        src={previewImage as string}
                        width={2000}
                        height={2000}
                        alt="ECG"
                        className="h-[300px] object-contain object-center"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-5 bg-red-500"
                        onClick={handleRemoveImage}
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[200px] border rounded-md">
                      <UploadCloudIcon className=" absolute  h-12 w-12" />
                      <p className=" pt-20 fontheading_c82e299b-module__dwMDXq__className text-lg">
                        Upload Header Image
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute top-[-100px] right-[-100px] w-[400px] h-[200px] opacity-0 cursor-pointer"
                        onChange={(e: any) =>
                          uploadImageToS3(e.target.files[0])
                        }
                      />
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <LoadingButton
              type="submit"
              className="rounded text-white font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] "
              disabled={isLoading || uploading}
              loading={isLoading}
            >
              Submit
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
};
