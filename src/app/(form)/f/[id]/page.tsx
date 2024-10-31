import { getSubmission, getSubmissionAccess } from "@/actions/submissions";
import { FormRenderer } from "@/components/form-renderer";
import { RichTextDisplay } from "@/components/react-quill";
import {
  TypographyH1,
  TypographyH2,
  TypographyMuted,
  TypographyP,
} from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env.mjs";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { FormStatus, SubmissionStatus } from "@prisma/client";
import { CircleIcon } from "lucide-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import { HeaderHelper } from "./_components/header-helper";
import notFound from "./not-found";
interface FormPageProperties {
  params: {
    id: string;
  };
  searchParams: {
    sid: string;
  };
}

const getForm = async ({ id }: { id: string }) => {
  const form = await db.form.findFirst({
    where: { id },
    include: {
      fields: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return form;
};

export async function generateMetadata({
  params,
}: FormPageProperties): Promise<Metadata> {
  const form = await getForm({ id: params.id });
  if (!form) {
    return {};
  }

  const url = env.NEXT_PUBLIC_APP_URL;

  const ogUrl = new URL(`${url}/api/og`);
  ogUrl.searchParams.set("heading", form.title);
  ogUrl.searchParams.set("type", "Form");

  return {
    title: form.title,
    description: form.description,
  };
}

const Form = async ({ params, searchParams }: FormPageProperties) => {
  const { id } = params;
  const { sid } = searchParams;
  const cookieStore = cookies();

  const sidcookie = cookieStore.get("sid");
  const fidcookie = cookieStore.get("fid");

  const form = await getForm({ id });
  if (form?.status !== FormStatus.PUBLIC) {
    return notFound();
  }
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let submission;
  if (sid) {
    submission = await getSubmission(sid, id);
  } else {
    if (sidcookie && fidcookie?.value === id) {
      submission = await getSubmission(sidcookie.value, fidcookie.value);
    }
  }

  if (!form?.published) {
    return notFound();
  }

  const submissionAccess = await getSubmissionAccess(sid);

  const hasHeaderContent = form.headerText && form.headerImage;

  if (!hasHeaderContent) {
    return (
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
              <div className="inline-flex items-center text-xl tracking-wide text-gray-600">
                <CircleIcon
                  className={cn(
                    "mr-2 h-3 w-3 text-transparent",
                    submission?.status === SubmissionStatus.SUBMITTED
                      ? "fill-green-600"
                      : "fill-yellow-600"
                  )}
                />
                <span>
                  {submission?.status === SubmissionStatus.SUBMITTED
                    ? "Submitted"
                    : "Draft"}
                </span>
              </div>
            </div>
          </TypographyH1>
          <Separator className="mb-8 mt-4" />
          <FormRenderer
            form={form}
            submission={submission}
            submissionAccess={submissionAccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="m-4">
      <div className="flex flex-col-reverse lg:flex-row gap-1 bg-black dark:bg-white p-1">
        {/* Left Side - Form */}
        <div className="bg-background pt-3 lg:w-1/2">
          <FormRenderer
            form={form}
            submission={submission}
            submissionAccess={submissionAccess}
          />
        </div>

        {/* Right Side - Content */}
        <div className="bg-white dark:bg-black p-6 flex flex-col lg:w-1/2">
          {/* Top Section */}
          <div className="flex-grow">
            <div className="aspect-video relative mb-6">
              <Image
                src={form.headerImage as string}
                alt="Header Image"
                fill
                className="rounded-lg object-cover"
              />
            </div>

            <TypographyH2 className="mb-4 text-center">
              {form.headerText}
            </TypographyH2>

            {form.formDescription && (
              <TypographyP className="text-md text-gray-500 text-justify">
                <RichTextDisplay content={form.formDescription} />
              </TypographyP>
            )}
          </div>

          {/* Footer Section */}
          {form.footerText && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <TypographyMuted className="text-center">
                {form.footerText}
              </TypographyMuted>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
