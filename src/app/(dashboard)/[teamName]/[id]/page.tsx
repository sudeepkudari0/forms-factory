import { getForm, getFormSubmissions } from "@/actions/forms";
import { DashboardHeader } from "@/components/header";
import { Icons } from "@/components/icons";
import { DashboardShell } from "@/components/shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit2Icon } from "lucide-react";
import Link from "next/link";
import CreateSubmissionDialog from "./_components/create-submissin-dialog";
import { SubmissionsTable } from "./_components/submissions-table";

interface UserFormPageProperties {
  params: {
    id: string;
    tname?: string;
  };
  searchParams: {
    fid: string;
  };
}

const UserFormPage = async ({ params }: UserFormPageProperties) => {
  const { id, tname } = params;
  const form = await getForm({ id: id });
  const submissions = await getFormSubmissions({ id: id });
  return (
    <DashboardShell>
      <div>
        <Link
          className={cn(buttonVariants({ variant: "link" }), "-ml-2")}
          href={tname ? `/user/${tname}` : "/user"} // use tname if present
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          All Forms
        </Link>
      </div>
      <DashboardHeader heading={form.title} text="Explore submissions.">
        <div className="flex w-full flex-col justify-end gap-2 md:w-fit md:flex-row">
          <Link
            href={`/forms/${id}/edit`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded w-[100px] text-white font-bold bg-gradient-to-r from-[#0077B6] to-[#00BCD4] hover:text-white"
            )}
          >
            <Edit2Icon className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <CreateSubmissionDialog formData={form} />
        </div>
      </DashboardHeader>
      <SubmissionsTable submissions={submissions} />
    </DashboardShell>
  );
};

export default UserFormPage;
