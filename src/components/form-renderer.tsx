"use client";

import {
  createDraftSubmission,
  createFinalSubmission,
} from "@/actions/submissions";
import { getPresignedUrl } from "@/actions/users";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type Field,
  type Form as Forms,
  type Submission,
  type SubmissionAccess,
  SubmissionStatus,
  type fieldType,
} from "@prisma/client";
import dayjs from "dayjs";
import { CalendarIcon, ChevronsUpDown, EyeIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";
import { z } from "zod";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
import { LoadingButton } from "./ui/loading-button";
import MultipleSelector, { type Option } from "./ui/multi-dropdown";
import {} from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
import { FaSpinner } from "react-icons/fa6";

type FormWithFields = Forms & {
  fields: Field[];
};

interface FormRendererProps {
  form: FormWithFields;
  preview?: boolean;
  submission?: Submission | null;
  submissionAccess?: SubmissionAccess[] | null;
}

// build validtion schema from form fields using zod. i.e. if field.type === "email" then add z.string().email() to schema. If its required then add .required()
const generateZodSchema = (
  fieldType: fieldType,
  required: boolean,
  isDraft: boolean
) => {
  let type: z.ZodType<any>;
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
    case "multi_dropdown":
      type = z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
            disable: z.boolean().optional(),
          })
        )
        .optional();
      break;
    default:
      type = z.string();
  }

  if (!required || isDraft) {
    type = type.optional();
  }

  return type;
};

const generateFormSchema = (
  formData: FormWithFields | undefined,
  isDraft: boolean
) => {
  if (!formData) {
    return z.object({});
  }
  const fieldSchemas = formData.fields.map((field) => {
    const fieldSchema = generateZodSchema(
      field.type as fieldType,
      field.required,
      isDraft
    );

    return {
      [field.label]: fieldSchema,
    };
  });

  return z
    .object({
      ...fieldSchemas.reduce((acc, fieldSchema, _index) => {
        return {
          ...acc,
          ...fieldSchema,
        };
      }, {}),
    })
    .superRefine((data) => {
      return {
        ...data,
      };
    });
};

export const FormRenderer = ({
  form: formData,
  submission,
  submissionAccess: _,
}: FormRendererProps) => {
  const [isDraft, setIsDraft] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [submissionStatus, _setSubmissionStatus] = useState<SubmissionStatus>(
    submission?.status || "DRAFT"
  );
  const [uploadingStates, setUploadingStates] = useState<
    Record<string, boolean>
  >({});

  const parsedData = JSON.parse((submission?.data as string) || "{}");
  const formSchema = generateFormSchema(formData, isDraft);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...(parsedData || {}),
    },
  });
  const router = useRouter();
  async function handleDraftSubmit(values: any) {
    setIsDraftLoading(true);
    await createDraftSubmission({
      submissionId: submission?.id as string,
      data: JSON.parse(JSON.stringify(values)),
      formId: formData?.id as string,
    });
    toast({
      variant: "default",
      title: "Success",
      description: "Your submission has been saved as a draft.",
    });
    setIsDraftLoading(false);
  }

  async function handleFinalSubmit(values: any) {
    setIsSubmitting(true);
    console.log(isDraft);
    await createFinalSubmission({
      submissionId: submission?.id as string,
      data: JSON.parse(JSON.stringify(values)),
      formId: formData?.id as string,
    });
    toast({
      variant: "default",
      title: "Success",
      description: "Your submission has been submitted.",
    });
    setIsSubmitting(false);
    router.push(`/f/${formData?.id}/success`);
  }

  async function onSubmit(values: any) {
    if (isDraft) {
      await handleDraftSubmit(values);
    } else {
      await handleFinalSubmit(values);
    }
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

  const uploadFileToS3 = async (pickedImage: File, fieldName: string) => {
    setUploadingStates((prev) => ({ ...prev, [fieldName]: true }));
    const file = pickedImage;
    try {
      const fileName = file.name;
      const presignedData = await getPresignedUrl(fileName);
      const presignedUrl = presignedData.presignedUrl;
      await uploadToS3PresignedUrl(file, presignedUrl, file.type);

      const publicUrl = presignedData.publicUrl;

      return publicUrl;
    } catch (error) {
      console.error(error);
      alert("Upload failed!");
    } finally {
      setUploadingStates((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset
            className="space-y-8"
            disabled={submissionStatus !== SubmissionStatus.DRAFT}
          >
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
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
                                    dayjs(field.value).format("MMM D, YYYY")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                // disabled={(date) =
                                //   date < new Date("1900-01-01") ||
                                //   date > new Date("2100-12-31")
                                // }
                                classNames={{
                                  day_hidden: "invisible",
                                  dropdown:
                                    "px-2 py-1.5 rounded-md bg-popover text-popover-foreground text-sm  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                                  caption_dropdowns: "flex gap-3",
                                  vhidden: "hidden",
                                  caption_label: "hidden",
                                }}
                                initialFocus
                                defaultMonth={field.value}
                                captionLayout="dropdown-buttons"
                                fromYear={1950}
                                toYear={2030}
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <FormDescription>
                            {fieldItem.description}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );

                case "dropdown":
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
                                <SelectValue
                                  placeholder={fieldItem.placeholder}
                                />
                                <ChevronsUpDown className="ml-2 h-4 w-4" />
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
                          <FormDescription>
                            {fieldItem.description}
                          </FormDescription>
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
                    <FormField
                      key={fieldItem.id}
                      control={form.control}
                      name={fieldItem.label}
                      render={({ field: _ }) => (
                        <FormItem>
                          <div className="inline-flex">
                            <FormLabel className="flex flex-row items-center gap-2 justify-center">
                              {fieldItem.label}
                              {uploadingStates[fieldItem.label] && (
                                <Loader2
                                  className={cn("h-4 w-4 animate-spin mr-2")}
                                />
                              )}
                              {_.value && (
                                <div className="inline-flex">
                                  <Link href={_.value} target="_blank">
                                    <EyeIcon className="mr-2 h-4 w-4" />
                                  </Link>
                                </div>
                              )}
                            </FormLabel>
                          </div>
                          <FormControl>
                            <div>
                              <Input
                                type="file"
                                disabled={
                                  submission?.status ===
                                  SubmissionStatus.SUBMITTED
                                }
                                placeholder={fieldItem.placeholder || undefined}
                                required={fieldItem.required || false}
                                onChange={async (e: any) => {
                                  const update = await uploadFileToS3(
                                    e.target.files[0],
                                    fieldItem.label
                                  );
                                  console.log(update);
                                  form.setValue(fieldItem.label, update);
                                }}
                              />
                            </div>
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

                case "multi_dropdown":
                  return (
                    <FormField
                      key={fieldItem.id}
                      control={form.control}
                      name={fieldItem.label}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{fieldItem.label}</FormLabel>
                          <FormControl>
                            <MultipleSelector
                              options={JSON.parse(
                                fieldItem.multipleOptions as string
                              )}
                              value={field.value as Option[]}
                              onChange={(selected) => {
                                field.onChange(selected);
                              }}
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
                default:
                  return null;
              }
            })}
            <div className="flex justify-end space-x-4 pb-4">
              <LoadingButton
                type="button"
                disabled={isDraftLoading}
                className="bg-gradient-to-r from-[#0077B6] to-[#00BCD4]"
                onClick={() => {
                  setIsDraft(true);
                  form.handleSubmit(onSubmit)();
                }}
                loading={isDraftLoading}
              >
                Save
              </LoadingButton>
              <LoadingButton
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#0077B6] to-[#00BCD4]"
                onClick={() => {
                  setIsDraft(false);
                }}
                loading={isSubmitting}
              >
                {formData?.submitText}
              </LoadingButton>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
