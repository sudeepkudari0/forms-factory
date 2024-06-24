import Link from "next/link"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <EmptyPlaceholder className="mx-auto max-w-[800px]">
      <EmptyPlaceholder.Icon name="warning" />
      <EmptyPlaceholder.Title>Uh oh! Not Found</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        This form could not be found. Please try again.
      </EmptyPlaceholder.Description>
      <Link href="/forms" className={buttonVariants({ variant: "ghost" })}>
        Go to Dashboard
      </Link>
    </EmptyPlaceholder>
  )
}
