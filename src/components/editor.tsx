"use client";

import { addField, deleteField, updateReorderFields } from "@/actions/fields";
import { setFormPublished } from "@/actions/forms";
import { CSVUploadDialog } from "@/app/(editor)/forms/[id]/edit/_components/upload-csv";
import { HeaderHelper } from "@/app/(form)/f/[id]/_components/header-helper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import type { Field, Form } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Reorder } from "framer-motion";
import { CircleIcon, PlusCircleIcon, ShareIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Typewriter } from "react-simple-typewriter";
import { EditFieldForm } from "./edit-field-form";
import { EditFormHeaders } from "./edit-form-headers";
import { FormRenderer } from "./form-renderer-preview";
import { Icons } from "./icons";
import { ModeToggle } from "./mode-toggle";
import {
  TypographyH1,
  TypographyH2,
  TypographyMuted,
  TypographyP,
} from "./typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button, buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LoadingButton } from "./ui/loading-button";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "./ui/use-toast";

type FormWithFields = Form & {
  fields: Field[];
};

const setPublishForm = async ({
  formId,
  publish,
}: {
  formId: string;
  publish: boolean;
}) => {
  await setFormPublished({
    id: formId,
    published: publish,
  });
  toast({
    title: `Form ${publish ? "published" : "unpublished"}`,
    description: `Form has been ${publish ? "published" : "unpublished"}`,
  });
};

const copyLinkToClipboard = async ({ formId }: { formId: string }) => {
  const url = `${env.NEXT_PUBLIC_APP_URL}/f/${formId}`;
  await navigator.clipboard.writeText(url);
  toast({
    title: "Copied to clipboard",
    description: "Link has been copied to clipboard",
  });
};

export const Editor = ({ form }: { form: FormWithFields }) => {
  useHotkeys("mod+c", () => {
    if (!form.published) {
      return;
    }
    copyLinkToClipboard({ formId: form.id });
  });
  const router = useRouter();
  const [fields, setFields] = useState<Field[]>(form.fields || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [unSavedChanges, setUnSavedChanges] = useState<{
    [key: string]: boolean;
  }>({});
  const [showWarning, setShowWarning] = useState(false);
  const [currentOpenAccordian, setCurrentOpenAccordian] = useState<string[]>(
    []
  );
  const [nextAccordionState, setNextAccordionState] = useState<string[]>([]);
  const [initialAccordionState, setInitialAccordionState] = useState<string[]>(
    []
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const formname = [form.title || "Untitled Form"];

  const queryClient = useQueryClient();

  const handleReorder = async (newOrder: Field[]) => {
    setFields(newOrder);
    startTransition(async () => {
      await updateReorderFields(newOrder);
    });
    queryClient.invalidateQueries({ queryKey: ["form", form.id] });
  };

  const handleAddField = async () => {
    setIsLoading(true);
    const newField = {
      label: "",
      type: null,
      required: false,
      placeholder: "",
      options: undefined,
      formId: form.id,
    };
    const data = await addField(newField);
    if (data) {
      setFields((prevFields) => [...prevFields, data]);
      setCurrentOpenAccordian((prev) => [...prev, data.id]);
    }
    setIsLoading(false);
  };

  const handleSaveField = (updatedField: Field) => {
    setIsUpdating(true);
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );
    setIsUpdating(false);
  };

  const handleSaveArrayOfFields = (updatedFields: Field[]) => {
    setIsUpdating(true);
    setFields((prevFields) => {
      const updatedFieldsMap = new Map(
        updatedFields.map((field) => [field.id, field])
      );

      const newFields = prevFields.map(
        (field) => updatedFieldsMap.get(field.id) || field
      );

      updatedFields.forEach((updatedField) => {
        if (!prevFields.some((field) => field.id === updatedField.id)) {
          newFields.push(updatedField);
        }
      });
      return newFields;
    });
    setIsUpdating(false);
  };

  const handleRemoveField = async (fieldId: string) => {
    setFields((prevFields) =>
      prevFields.filter((field) => field.id !== fieldId)
    );
    await deleteField(fieldId);
    toast({
      title: "Field deleted",
      description: "Field has been deleted",
    });
  };

  const handleAccordianChange = (value: string[]) => {
    const closingAccordions = currentOpenAccordian.filter(
      (id) => !value.includes(id)
    );
    const hasUnsavedChanges = closingAccordions.some(
      (id) => unSavedChanges[id]
    );

    if (closingAccordions.length > 0 && hasUnsavedChanges) {
      setInitialAccordionState(currentOpenAccordian);
      setNextAccordionState(value);
      setShowWarning(true);
    } else {
      setCurrentOpenAccordian(value);
    }
  };

  const handleConfirmClose = () => {
    setShowWarning(false);
    setCurrentOpenAccordian(initialAccordionState);
  };

  const handleCancelClose = () => {
    setShowWarning(false);
    setCurrentOpenAccordian(nextAccordionState);
    const closedAccordions = currentOpenAccordian.filter(
      (id) => !nextAccordionState.includes(id)
    );
    const updatedUnsavedChanges = { ...unSavedChanges };
    closedAccordions.forEach((id) => {
      delete updatedUnsavedChanges[id];
    });
    setUnSavedChanges(updatedUnsavedChanges);
  };

  const updateUnsavedChanges = (fieldId: string, hasChanges: boolean) => {
    setUnSavedChanges((prev) => ({
      ...prev,
      [fieldId]: hasChanges,
    }));
  };

  return (
    <div className="grid w-full gap-10">
      <div
        className={cn(
          "flex flex-col w-full gap-2 bg-blue-100 py-2 md:py-0 space-y-2 md:space-y-0 items-center rounded md:justify-between md:flex-row md:p-4 dark:bg-zinc-700"
        )}
      >
        <div className="flex items-center md:space-x-10">
          <Button variant={"ghost"} onClick={() => router.back()}>
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className={cn(
                  "text-white",
                  form.published
                    ? "bg-green-500 hover:bg-green-500"
                    : "bg-yellow-400 hover:bg-yellow-400"
                )}
              >
                <CircleIcon
                  className={cn(
                    "mr-2 h-2 w-2 text-transparent",
                    form.published ? "fill-green-600" : "fill-yellow-600"
                  )}
                />
                {form.published ? "Published" : "Draft"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={String(form.published)}
                onValueChange={(value) =>
                  setPublishForm({
                    formId: form.id,
                    publish: value === "true",
                  })
                }
              >
                <DropdownMenuRadioItem value="true">
                  Publish
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="false">
                  Draft
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <LoadingButton
              loading={isPending}
              variant={"link"}
              className="hover:no-underline"
            >
              {isPending ? (
                <p>Reorder saving</p>
              ) : (
                <p className="flex flex-row items-center justify-center gap-2">
                  <Icons.doubleCheck /> <span>Reorder saved</span>
                </p>
              )}
            </LoadingButton>
          </div>
        </div>
        <p className="text-xl from-accent-foreground trackin-light max-w-sm overflow-hidden truncate">
          <Typewriter words={formname} />
        </p>
        <div className="flex justify-end gap-4">
          <ModeToggle />
          <CSVUploadDialog
            trigger={
              <Button variant="secondary">
                <Icons.upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            }
            formId={form.id}
            onSubmitted={handleSaveArrayOfFields}
          />
          {/* <FeedbackButton className="hidden md:block" userId={user.id} /> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={!form.published}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Share <ShareIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => copyLinkToClipboard({ formId: form.id })}
                >
                  <Icons.copy className="mr-2 h-4 w-4" />
                  <span>Copy link</span>
                  <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Tabs defaultValue="editor" className="container">
        <TabsList className="mx-auto mb-8 grid md:w-[400px] grid-cols-3">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="mx-auto w-full space-x-4">
          <Reorder.Group
            axis="y"
            values={fields}
            onReorder={(newOrder) => handleReorder(newOrder as Field[])}
          >
            <Accordion
              type="multiple"
              onValueChange={handleAccordianChange}
              value={currentOpenAccordian}
            >
              {fields.map((fieldItem, index) => (
                <Reorder.Item key={fieldItem.id} value={fieldItem}>
                  <AccordionItem value={`${fieldItem.id}`}>
                    <AccordionTrigger value={`${fieldItem.id}`}>
                      <p className="font-heading text-xl font-bold">
                        {fieldItem.label
                          ? fieldItem.label
                          : `Field ${index + 1}`}
                      </p>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center">
                        {isUpdating ? (
                          <h1>Updating</h1>
                        ) : (
                          <EditFieldForm
                            key={fieldItem.id}
                            field={fieldItem}
                            formId={form.id}
                            onDelete={handleRemoveField}
                            onSubmitted={handleSaveField}
                            setUnSaved={(hasChanges) =>
                              updateUnsavedChanges(fieldItem.id, hasChanges)
                            }
                          />
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Reorder.Item>
              ))}
              <div className="w-full flex items-center">
                <LoadingButton
                  variant={"ghost"}
                  className="mx-auto mt-2 border bg-black dark:bg-zinc-200 dark:text-black text-white"
                  onClick={handleAddField}
                  loading={isLoading}
                >
                  {!isLoading && <PlusCircleIcon className={"mr-2 h-4 w-4"} />}
                  Add field
                </LoadingButton>
              </div>
              {showWarning && (
                <AlertDialog open={showWarning}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                      <AlertDialogDescription>
                        You have unsaved changes. Are you sure you want to
                        proceed without saving?
                      </AlertDialogDescription>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleConfirmClose}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className={buttonVariants({ variant: "destructive" })}
                          onClick={handleCancelClose}
                        >
                          Proceed
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogHeader>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </Accordion>
          </Reorder.Group>
        </TabsContent>
        <TabsContent value="preview">
          <div className="md:container md:my-8">
            {form.headerText && form.headerImage ? (
              <div className="flex flex-col-reverse lg:flex-row bg-black dark:bg-white rounded-sm">
                <div
                  className="overflow-y-auto h-auto lg:w-1/2 md:h-[calc(100vh-100px)] rounded-sm bg-background p-4 mr-2 lg:mr-0 lg:mt-2 ml-2 mb-2"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "gray",
                  }}
                >
                  <FormRenderer formData={form} preview />
                </div>
                <div
                  className="bg-white dark:bg-black md:h-[calc(100vh-100px)] overflow-y-auto flex flex-col lg:w-1/2 justify-between rounded-sm m-2"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "gray",
                  }}
                >
                  <div className="flex flex-col items-center">
                    {form.headerImage && (
                      <Image
                        src={form?.headerImage}
                        alt="Header Image"
                        width={1000}
                        height={1000}
                        className="max-h-[300px] mx-2 w-full object-contain"
                      />
                    )}
                    <TypographyH2 className=" font-jost mt-6 text-center md:pt-0 w-full">
                      <span>{form?.headerText}</span>
                    </TypographyH2>
                    {form.formDescription && (
                      <TypographyP className="text-md px-4 text-justify text-gray-500 w-full">
                        {form?.formDescription}
                      </TypographyP>
                    )}
                  </div>
                  {form.footerText && (
                    <div className="my-2 mt-8 text-center flex flex-col items-center justify-center text-gray-400 w-full">
                      <TypographyMuted>{form?.footerText}</TypographyMuted>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="container my-8 max-w-3xl">
                <div className="space-y-8">
                  <HeaderHelper />
                  <TypographyH1 className="pt-6 md:pt-0">
                    <div className="flex flex-row items-center justify-between">
                      <div>
                        <span>{form?.title}</span>
                        <span className="text-lg text-gray-600 tracking-wide">
                          &nbsp;(Form)
                        </span>
                      </div>
                    </div>
                  </TypographyH1>
                </div>
                <Separator className="mb-8 mt-4" />
                <FormRenderer
                  formData={form}
                  preview
                  // submission={submission}
                  // submissionAccess={submissionAccess}
                />
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="headers">
          <EditFormHeaders formData={form} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
