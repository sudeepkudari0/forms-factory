import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { TypographyH1, TypographyLead } from "@/components/typography"
import { buttonVariants } from "@/components/ui/button"

const FormSuccess = async ({ params: _ }: { params: { id: string } }) => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <div className="space-y-8 text-center">
        <TypographyH1>Success</TypographyH1>
        <TypographyLead>Form submitted successfully</TypographyLead>
        <Link href="/onboarding" className={buttonVariants({ variant: "ghost" })}>
          <ArrowRight className="mr-2 h-4 w-4" />
          Back Home
        </Link>
      </div>
    </div>
  )
}

export default FormSuccess
