"use client";

import { addField, updateField } from "@/actions/fields";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AtSignIcon,
  CalendarIcon,
  CircleDotIcon,
  HashIcon,
  LinkIcon,
  PhoneIcon,
  TextIcon,
  ToggleLeftIcon,
  Trash2,
  TypeIcon,
  Upload,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type Field, fieldType } from "@prisma/client";
import { Icons } from "./icons";
import { Button, buttonVariants } from "./ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { useToast } from "./ui/use-toast";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});
const multiOptionsFormSchema = z.array(optionSchema);

const formSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(2).max(256),
  description: z.string().max(512).optional(),
  type: z.nativeEnum(fieldType),
  placeholder: z.string().max(256).optional(),
  required: z.boolean(),
  formId: z.string(),
  options: z.string().min(1).max(50).array().optional(),
  multi_options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        disable: z.boolean().optional(),
      })
    )
    .optional(),
  saved: z.boolean().default(false),
});

type MultiOption = {
  label: string;
  value: string;
  disable?: boolean;
};

type FormType = {
  id: string;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
  type: fieldType;
  formId: string;
  options: string[];
  multi_options: MultiOption[];
};

export const EditFieldForm = ({
  formId,
  field: fieldData,
  onSubmitted,
  onDelete,
  setUnSaved,
}: {
  formId: string;
  field?: Field;
  onSubmitted?: (updatedField: Field) => void;
  onDelete: (fieldId: string) => void;
  setUnSaved: (unSaved: boolean) => void;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(fieldData?.saved || false);
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: fieldData?.id || undefined,
      label: fieldData?.label || "",
      description: fieldData?.description || "",
      placeholder: fieldData?.placeholder || "",
      required: fieldData?.required || false,
      type: fieldData?.type || undefined,
      formId: fieldData?.formId || formId,
      options: fieldData?.options?.length ? fieldData.options.split(",") : [],
      multi_options:
        (JSON.parse(fieldData?.multipleOptions as string) as MultiOption[]) ||
        [],
    },
  });

  useEffect(() => {
    const subscription = form.watch((_value, { type }) => {
      if (type === "change") {
        setUnSaved(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setUnSaved]);

  async function onSubmit(values: FormType) {
    setIsLoading(true);
    const plainOptions = values.options?.join(",");
    const multiDropdownOptions = values.multi_options || [];

    const requestData = {
      ...values,
      options: plainOptions,
      saved: true,
      multi_options: multiDropdownOptions,
    };

    if (values.id) {
      const updatedField = await updateField(requestData);
      if (onSubmitted && updatedField) {
        onSubmitted(updatedField);
        setIsSaved(true);
        setUnSaved(false);
      }
    } else {
      const updatedField = await addField(requestData);
      if (onSubmitted) {
        onSubmitted(updatedField);
        setIsSaved(true);
        setUnSaved(false);
      }
    }

    toast({
      title: "Field saved",
      description: "Your field has been saved.",
    });
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="m-2 grid grid-cols-1 flex-wrap gap-1 md:grid-cols-2 lg:flex"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-start rounded-lg p-3">
              <FormControl>
                <div className="relative w-full">
                  <input
                    {...field}
                    type="text"
                    id="label"
                    className={cn(
                      "focus:ring-3 peer block w-full appearance-none rounded-lg border-2 bg-transparent px-2.5 pb-1.5 pt-3 text-sm  focus:border-blue-600 focus:outline-none"
                    )}
                    disabled={isSaved}
                    onChange={(e) => {
                      field.onChange(e);
                      setUnSaved(true);
                    }}
                    placeholder=" "
                  />
                  <label
                    htmlFor="label"
                    className={cn(
                      "absolute start-1 top-1 -z-10 origin-[0] -translate-y-3 scale-75 bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:z-10 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500",
                      field.value ? "z-20" : ""
                    )}
                  >
                    Label
                  </label>
                </div>
              </FormControl>
              <FormDescription>The fields label.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-start rounded-lg p-3">
              <FormControl>
                <div className="relative w-full">
                  <input
                    {...field}
                    type="text"
                    id="placeholder"
                    className={cn(
                      "focus:ring-3 peer block w-full appearance-none rounded-lg border-2 bg-transparent px-2.5 pb-1.5 pt-3 text-sm  focus:border-blue-600 focus:outline-none"
                    )}
                    disabled={isSaved}
                    onChange={(e) => {
                      field.onChange(e);
                      setUnSaved(true);
                    }}
                    placeholder=" "
                  />
                  <label
                    htmlFor="placeholder"
                    className={cn(
                      "absolute start-1 top-1 -z-10 origin-[0] -translate-y-3 scale-75 bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:z-10 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500",
                      field.value ? "z-20" : ""
                    )}
                  >
                    Placeholder
                  </label>
                </div>
              </FormControl>
              <FormDescription>
                Text displayed inside the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-start rounded-lg p-3">
              <FormControl>
                <div className="relative w-full">
                  <input
                    {...field}
                    type="text"
                    id="description"
                    className="focus:ring-3 peer block w-full appearance-none rounded-lg border-2 bg-transparent px-2.5 pb-1.5 pt-3 text-sm  focus:border-blue-600 focus:outline-none"
                    disabled={isSaved}
                    onChange={(e) => {
                      field.onChange(e);
                      setUnSaved(true);
                    }}
                    placeholder=" "
                  />
                  <label
                    htmlFor="description"
                    className={cn(
                      "absolute start-1 top-1 -z-10 origin-[0] -translate-y-3 scale-75 bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:z-10 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500",
                      field.value ? "z-20" : ""
                    )}
                  >
                    Description
                  </label>
                </div>
              </FormControl>
              <FormDescription>What this field is about.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-start rounded-lg p-3">
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setUnSaved(true);
                }}
                defaultValue={field.value}
                disabled={isSaved}
              >
                <FormControl>
                  <SelectTrigger
                    required
                    className="focus:ring-3 peer block w-full appearance-none rounded-lg border-2 bg-transparent text-sm  focus:border-blue-600 focus:outline-none"
                  >
                    <SelectValue placeholder="Select the fields type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full h-[300px] overflow-y-auto px-2.5 pb-1.5 pt-3">
                  <SelectItem value="text">
                    <div className="flex items-center">
                      <TypeIcon className="mr-2 h-4 w-4" />
                      <span>Short answer</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="textarea">
                    <div className="flex items-center">
                      <TextIcon className="mr-2 h-4 w-4" />
                      <span>Long answer</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="number">
                    <div className="flex items-center">
                      <HashIcon className="mr-2 h-4 w-4" />
                      <span>Number</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center">
                      <AtSignIcon className="mr-2 h-4 w-4" />
                      <span>Email</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="tel">
                    <div className="flex items-center">
                      <PhoneIcon className="mr-2 h-4 w-4" />
                      <span>Phone</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="url">
                    <div className="flex items-center">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      <span>URL</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="date">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Date</span>
                    </div>
                  </SelectItem>
                  {/* <SelectItem value="time">
                    <div className="flex items-center">
                      <ClockIcon className="mr-2 h-4 w-4" />
                      <span>Time</span>
                    </div>
                  </SelectItem> */}
                  <SelectItem value="checkbox">
                    <div className="flex items-center">
                      <ToggleLeftIcon className="mr-2 h-4 w-4" />
                      <span>Checkbox</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dropdown">
                    <div className="flex items-center">
                      <CircleDotIcon className="mr-2 h-4 w-4" />
                      <span>Dropdown (Single Select)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="multi_dropdown">
                    <div className="flex items-center">
                      <CircleDotIcon className="mr-2 h-4 w-4" />
                      <span>Dropdown (Multi Select)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="upload">
                    <div className="flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      <span>Upload</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>The data the field will accept.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("type") === "dropdown" && (
          <FormField
            control={form.control}
            name={"options"}
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center rounded-lg p-3">
                <FormLabel>Options</FormLabel>
                <FormControl>
                  <OptionsForm
                    options={field.value || []}
                    onChange={(options) => {
                      field.onChange(options);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Enter one option per line. The first option will be selected
                  by default.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {form.watch("type") === "multi_dropdown" && (
          <FormField
            control={form.control}
            name={"multi_options"}
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center rounded-lg p-3">
                <FormLabel>Options</FormLabel>
                <FormControl>
                  <MultiOptionsForm
                    options={
                      typeof field.value === "string"
                        ? JSON.parse(field.value)
                        : field.value || []
                    }
                    onChange={(options) => {
                      field.onChange(options);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Enter one option per line. The first option will be selected
                  by default.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-center space-x-3 rounded-lg p-3">
              <FormControl>
                <div className="space-y-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={(e) => {
                      field.onChange(e);
                      setUnSaved(true);
                    }}
                    disabled={isSaved}
                  />
                  <FormDescription>Required?</FormDescription>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <LoadingButton
          loading={isLoading}
          variant={"ghost"}
          type="submit"
          className="mt-3"
          disabled={isSaved}
        >
          {!isLoading && (
            <Icons.check className={cn(isSaved ? "text-green-600" : "")} />
          )}
        </LoadingButton>
        <Button
          variant={"ghost"}
          type="submit"
          className="mt-3"
          disabled={!isSaved}
          onClick={() => {
            setIsSaved(false);
            setUnSaved(true);
          }}
        >
          <Icons.edit className={cn(isSaved ? "text-blue-600" : "")} />
        </Button>
        {fieldData?.id && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"ghost"} type="submit" className="mt-3">
                <Trash2 className=" cursor-pointer text-red-600" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are going to delete this field, it will be{" "}
                  <b> deleted </b>
                  permanently.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={() => onDelete(fieldData.id)}
                  >
                    Delete Field
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </form>
    </Form>
  );
};

interface OptionsFormProps {
  options: string[];
  onChange: (options: string[]) => void;
}

const optionsFormSchema = z.object({ option: z.string().min(1).max(50) });
type OptionsForm = z.infer<typeof optionsFormSchema>;

const OptionsForm = ({ onChange, options: initData }: OptionsFormProps) => {
  const form = useForm<OptionsForm>({
    resolver: zodResolver(optionsFormSchema),
  });

  const [options, setOptions] = useState<string[]>(initData || []);

  const onSubmit = async (data: OptionsForm) => {
    // if (!form.formState.isValid) return
    setOptions([...options, data.option]);
    form.reset({ option: "" });
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onChange(options);
  }, [options]);

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-y-2 divide-y">
        {options?.map((option, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-between truncate text-xs font-medium"
          >
            <div>{option}</div>
            <Button onClick={() => removeOption(index)} variant={"ghost"}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <FormItem>
          <div className="">
            <Input
              placeholder={`Add option ${options.length + 1}`}
              {...form.register("option")}
            />
          </div>
        </FormItem>

        <Button variant={"secondary"} onClick={form.handleSubmit(onSubmit)}>
          <Icons.add className="mr-2 h-4 w-4" />
          Add option
        </Button>
      </div>
    </div>
  );
};

interface MultiOptionsFormProps {
  options: {
    label: string;
    value: string;
    disable?: boolean;
  }[];
  onChange: (
    options: { label: string; value: string; disable?: boolean }[]
  ) => void;
}

const multiOptionsSchema = z.object({
  option: z.string(),
});

type MultiOptionsFormData = z.infer<typeof multiOptionsSchema>;

const MultiOptionsForm = ({
  onChange,
  options: initData,
}: MultiOptionsFormProps) => {
  const form = useForm<MultiOptionsFormData>({
    resolver: zodResolver(multiOptionsSchema),
  });

  const [options, setOptions] =
    useState<{ label: string; value: string; disable?: boolean }[]>(initData);

  const onSubmit = (data: MultiOptionsFormData) => {
    const newOption = { label: data.option, value: data.option };
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions, newOption];
      onChange(updatedOptions);
      return updatedOptions;
    });
    form.reset();
  };

  const removeOption = (index: number) => {
    setOptions((prevOptions) => {
      const updatedOptions = prevOptions.filter((_, i) => i !== index);
      onChange(updatedOptions);
      return updatedOptions;
    });
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-y-2 divide-y">
        {options?.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between truncate text-xs font-medium"
          >
            <div>{option.label}</div>
            <Button onClick={() => removeOption(index)} variant="ghost">
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <FormItem>
          <div>
            <Input
              placeholder={`Add option ${options.length + 1}`}
              {...form.register("option")}
            />
          </div>
        </FormItem>
        <Button variant="secondary" onClick={form.handleSubmit(onSubmit)}>
          <Icons.add className="mr-2 h-4 w-4" />
          Add option
        </Button>
      </div>
    </div>
  );
};
