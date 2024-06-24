"use client"

import { DownloadIcon, Loader2Icon } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import { downloadFile } from "@/lib/utils"

export default function ExportButton({
  formId,
  selectedUser,
  selectedteam,
}: { formId: string; selectedUser: string | null; selectedteam: string | null }) {
  const [isLoading, setLoading] = React.useState(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    await downloadFile(
      `/api/forms/${formId}/submissions/export?format=csv&uid=${selectedUser}&fid=${selectedteam}`,
      "submissions.csv"
    )
    setLoading(false)
  }
  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" variant={"secondary"} disabled={isLoading}>
        {isLoading ? (
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <DownloadIcon className="mr-2 h-4 w-4" />
        )}
        Export CSV
      </Button>
    </form>
  )
}
