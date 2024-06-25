import { getSubmission, getSubmissionAccess } from "@/actions/submissions";
import { FormRenderer } from "@/components/form-renderer";
import { TypographyH1 } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env.mjs";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { FormStatus, SubmissionStatus } from "@prisma/client";
import { CircleIcon } from "lucide-react";
import type { Metadata } from "next";
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
  const form = await getForm({ id });
  console.log({ id, sid });
  if (form?.status !== FormStatus.PUBLIC) {
    return notFound();
  }
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let submission;
  if (sid) {
    submission = await getSubmission(sid);
  }

  if (!form?.published) {
    return notFound();
  }

  const submissionAccess = await getSubmissionAccess(sid);

  return (
    <div>
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
        form={form as any}
        submission={submission}
        submissionAccess={submissionAccess}
      />
    </div>
  );
};

export default Form;
