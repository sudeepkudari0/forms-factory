"use client";

import { createSubmission } from "@/actions/submissions";
import { Icons } from "@/components/icons";
import {} from "@/components/ui/dialog";
import {} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import type { Form as FormType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateSubmissionDialog = ({ formData }: { formData: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit() {
    setIsLoading(true);
    const update = await createSubmission({
      formId: formData.id,
    });
    router.push(`/f/${formData.id}?sid=${update?.id}`);
    setIsLoading(false);
  }

  return (
    <LoadingButton
      loading={isLoading}
      className="rounded w-[200px] text-white font-bold  bg-gradient-to-r from-[#0077B6] to-[#00BCD4] "
      onClick={() => onSubmit()}
    >
      <Icons.submission className="mr-2 h-4 w-4" />
      <span>New Submission</span>
    </LoadingButton>
  );
};

export default CreateSubmissionDialog;
