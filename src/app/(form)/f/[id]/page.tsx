import { getSubmission, getSubmissionAccess } from "@/actions/submissions";
import { FormRenderer } from "@/components/form-renderer";
import {
  TypographyH1,
  TypographyH2,
  TypographyMuted,
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

  return (
    <div className="container my-8">
      {form.headerText && form.headerImage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 bg-[#00BCD4] rounded-md">
          <div className="overflow-y-auto h-[calc(100vh-100px)] bg-background rounded-md pt-4 mt-4 ml-4 mb-4">
            <FormRenderer
              form={form}
              submission={submission}
              submissionAccess={submissionAccess}
            />
          </div>
          <div className="bg-blue-900 flex flex-col justify-between rounded-md p-4">
            <div className="flex flex-col items-center">
              {form.headerImage && (
                <Image
                  src={form.headerImage}
                  alt="Header Image"
                  width={500}
                  height={300}
                  className="max-h-[300px] w-full"
                />
              )}
              <TypographyH2 className="mt-6 text-center text-zinc-100 md:pt-0 w-full truncate">
                <span>{form.headerText}</span>
              </TypographyH2>
              {form.formDescription && (
                <p className="text-md text-center text-gray-300 w-full truncate">
                  {form.formDescription}
                </p>
              )}
            </div>
            {form.footerText && (
              <div className="mt-8 text-center flex flex-col items-center justify-center text-gray-200 w-full truncate">
                <TypographyMuted>{form.footerText}</TypographyMuted>
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
          </div>
          <Separator className="mb-8 mt-4" />
          <FormRenderer
            form={form}
            submission={submission}
            submissionAccess={submissionAccess}
          />
        </div>
      )}
    </div>
  );
};

export default Form;
