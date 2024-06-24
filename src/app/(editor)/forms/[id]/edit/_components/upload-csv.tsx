"use client"

import { atoms } from "@/components/atoms/atom"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { toast } from "@/components/ui/use-toast"
import type { Field } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useAtom } from "jotai"
import { useState } from "react"
import React from "react"

export const CSVUploadDialog = ({
  formId,
  trigger,
  onSubmitted,
}: {
  formId: string
  trigger: React.ReactElement
  onSubmitted?: (updatedField: Field[]) => void
}) => {
  const formData = new FormData()
  const [file, setFile] = useState<File>()
  const [isOpen, setIsOpen] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [_editorRefetch, setEditorRefetch] = useAtom(atoms.editorRefctchAtom)

  const _queryClient = useQueryClient()

  const { mutate: uploadCSVMutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post("/api/import-form", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
    onMutate: () => {
      setIsUploading(true)
    },
    onSuccess: (response) => {
      const updatedData = response?.updated
      if (updatedData.length > 0 && onSubmitted) {
        onSubmitted(updatedData)
      }
      setEditorRefetch((prev) => !prev)
      setIsUploading(false)
      toast({
        title: "Success",
        description: "CSV data uploaded successfully",
      })
      setIsOpen(false)
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: "Failed to upload CSV data",
      })
      console.log(err)
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
    setIsSelected(true)
  }
  const handleUpload = () => {
    setIsUploading(true)
    if (!file) {
      return
    }
    formData.append("file", file)
    formData.append("formId", formId)
    uploadCSVMutate(formData)
    setIsUploading(false)
  }

  const handleDownloadTemplate = () => {
    const templateUrl = "/template.xlsx"
    const link = document.createElement("a")
    link.href = templateUrl
    link.download = "template.xlsx"
    link.click()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
      }}
    >
      <DialogTrigger asChild>
        {React.cloneElement(trigger, {
          onClick: () => setIsOpen(true),
        })}
      </DialogTrigger>
      <DialogContent className="rounded sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload CSV</DialogTitle>
          <DialogDescription>
            Please download the below given template and fill accordingly
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-2">
          <Input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
          <LoadingButton
            onClick={handleUpload}
            loading={isUploading}
            disabled={!isSelected}
            className="mt-2"
          >
            {!isUploading ? <Icons.upload className="h-5 w-5 mr-2" /> : null}
            Upload CSV
          </LoadingButton>
        </div>
        <DialogFooter className="border p-2 rounded">
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col">
              <p className="text-md font-heading">Instructions</p>
              <p className="text-sm font-sans">
                Template has pre-filled data-validation(XLSX) format.
              </p>
              <p className="text-sm font-sans" />
            </div>
            <Button variant={"outline"} onClick={handleDownloadTemplate}>
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
