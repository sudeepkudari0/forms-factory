"use client";

import { createFormHeaders } from "@/actions/forms";
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
import { UploadDropzone } from "@/lib/uploadthing";
import { bytesToSize } from "@/utils/misc";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Form as FormType } from "@prisma/client";
import { useState } from "react";
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
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");

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

  async function onSubmit(values: formSchema) {
    setIsLoading(true);
    const data = await createFormHeaders({
      ...values,
    });
    console.log(data);
    toast({
      title: "Form Updated",
      description: "Your form has been updated.",
    });
    setIsLoading(false);
  }
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
                    placeholder="Give the user some context about the form..."
                    className="resize-none"
                    maxLength={512}
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
                <FormLabel>Header Image</FormLabel>
                <FormControl>
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
                        setFileName(res[0].name);
                        const size = bytesToSize(res[0].size);
                        setFileSize(size);
                        form.setValue("headerImage", res[0].url);
                      }
                    }}
                    onUploadError={() => {
                      console.log("onUploadError");
                    }}
                  />
                </FormControl>
                {fileName && fileSize ? (
                  <>
                    <div className="flex space-x-5 pl-1 text-sm font-medium">
                      <dt className="pt-2">File Name: </dt>
                      <dd className="pt-2">{fileName}</dd>
                    </div>
                    <div className="flex space-x-8 pl-1 text-sm font-medium">
                      <dt className="">File Size:</dt>
                      <dd className="">{fileSize}</dd>
                    </div>
                  </>
                ) : null}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <LoadingButton
              type="submit"
              className="rounded text-white font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] "
              disabled={isLoading}
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
