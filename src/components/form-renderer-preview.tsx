"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Form as Forms } from "@prisma/client";
import { format } from "date-fns";
import type { InferModel } from "drizzle-orm";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";
import { z } from "zod";

import { fields } from "@/lib/db/schema";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

type Field = InferModel<typeof fields, "select">;

type FormWithFields = Forms & {
  fields: Field[];
};

interface FormRendererProps {
  formData: FormWithFields;
  preview?: boolean;
}

const fieldTypeSchema = z.enum(fields.type.enumValues);
type FieldType = z.infer<typeof fieldTypeSchema>;

// build validtion schema from form fields using zod. i.e. if field.type === "email" then add z.string().email() to schema. If its required then add .required()
const generateZodSchema = (fieldType: FieldType, required: boolean) => {
  let type: z.ZodType<any, any> | undefined;
  switch (fieldType) {
    case "text":
      type = z.string();
      break;
    case "number":
      type = z.string();
      break;
    case "email":
      type = z.string().email();
      break;
    case "textarea":
      type = z.string().max(512);
      break;
    case "checkbox":
      type = z.boolean();
      break;
    case "url":
      type = z.string().url();
      break;
    case "tel":
      type = z.string().refine(validator.isMobilePhone);
      break;
    case "date":
      type = z.date();
      break;
    case "upload":
      type = z.string();
      break;
    // Add more field types and their corresponding schema definitions here
    default:
      // Default to treating unknown field types as strings
      type = z.string();
  }

  if (!required) {
    type = type.optional();
  }

  return type;
};

const generateFormSchema = (
  formData: FormWithFields | undefined,
  fileName: string
) => {
  if (!formData) {
    return z.object({});
  }
  const fieldSchemas = formData.fields.map((field) => {
    const fieldSchema = generateZodSchema(
      field.type as FieldType,
      field.required
    );

    return {
      [field.label]: fieldSchema,
    };
  });

  // Create an object with additional properties
  const formObject = {
    filename: fileName,
    title: "HihIhih",
  };

  return z
    .object({
      // Dynamically generated Zod object schema based on the fields (unchanged)
      ...fieldSchemas.reduce((acc, fieldSchema, _index) => {
        return {
          ...acc,
          ...fieldSchema,
        };
      }, {}),
    })
    .superRefine((data) => {
      // Ensure title and fileName are preserved
      return {
        ...data,
        ...formObject,
      };
    });
};

export const FormRenderer = ({ formData }: FormRendererProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>();

  const formSchema = generateFormSchema(formData, fileName);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(_values: any) {
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Preview mode");
      setIsSubmitting(false);
    }, 1000);
  }
  console.log(formData);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formData?.fields.map((fieldItem) => {
          switch (fieldItem.type) {
            case "text":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldItem.placeholder || undefined}
                          required={fieldItem.required || false}
                          {...field}
                          value={field.value as string}
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            case "textarea":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value as string}
                          required={fieldItem.required}
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            case "email":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldItem.placeholder || undefined}
                          required={fieldItem.required || false}
                          {...field}
                          value={field.value as string}
                          type="email"
                          icon={"atSign"}
                          autoComplete="email"
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            case "checkbox":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 pl-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{fieldItem.label}</FormLabel>
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              );
            case "number":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldItem.placeholder || undefined}
                          {...field}
                          required={fieldItem.required || false}
                          value={field.value as string}
                          icon="hash"
                          type="number"
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            case "url":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldItem.placeholder || undefined}
                          required={fieldItem.required || false}
                          {...field}
                          icon="link"
                          value={field.value as string}
                          type="url"
                          autoComplete="url"
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            case "tel":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldItem.placeholder || undefined}
                          required={fieldItem.required || false}
                          {...field}
                          icon="phone"
                          value={field.value as string}
                          type="tel"
                          autoComplete="tel"
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            case "date":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "justify-start pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                              {field.value ? (
                                format(field.value as Date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value as Date}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>{fieldItem.description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );

            case "radio":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value as string}
                      >
                        <FormControl>
                          <SelectTrigger required={fieldItem.required}>
                            <SelectValue placeholder={fieldItem.placeholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fieldItem.options
                            ?.split(",")
                            .map((option, index) => (
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>{fieldItem.description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            case "time":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldItem.placeholder || undefined}
                          required={fieldItem.required || false}
                          {...field}
                          icon="clock"
                          value={field.value as string}
                          type="time"
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            case "upload":
              return (
                <div>
                  <p>{fieldItem.label}</p>
                  <UploadDropzone
                    endpoint="fileUpload"
                    config={{
                      mode: "auto",
                    }}
                    className=" pt-2"
                    onClientUploadComplete={async (res) => {
                      if (res) {
                        form.setValue(fieldItem.label, res[0].url);
                        setFileName(res[0].name);
                        const reSize = res[0].size;
                        setFileSize(reSize);
                      }
                    }}
                    onUploadError={() => {
                      console.log("onUploadError");
                    }}
                  />
                  <div className="flex space-x-5 py-3 pl-1 text-sm font-medium text-white">
                    <dt className="pt-2">File Name: </dt>
                    <dd className="pt-2">{fileName}</dd>
                  </div>
                  <div className="flex space-x-8 py-3 pl-1 text-sm font-medium text-white">
                    <dt className="">File Size:</dt>
                    <dd className="">{fileSize}</dd>
                  </div>
                  <p>{fieldItem.description}</p>
                </div>
              );
            default:
              return null;
          }
        })}
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {formData?.submitText}
        </Button>
      </form>
    </Form>
  );
};
