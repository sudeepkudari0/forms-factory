"use client"

import { updateFormAccess } from "@/actions/forms"
import { getAllUsersWithCollaborators } from "@/actions/users"
import { CardSkeleton } from "@/components/card-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LoadingButton } from "@/components/ui/loading-button"
import { toast } from "@/components/ui/use-toast"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import React from "react"
import Select from "react-select"

export const AddColaboratorsDialog = ({
  submissionId,
  trigger,
  formId,
}: {
  submissionId?: string
  formId: string
  trigger: React.ReactElement
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const { data: CurrentCollaborators, isLoading: loadingCollaborators } = useQuery({
    queryKey: ["currentCollaborators", submissionId],
    queryFn: async () => {
      const response = await getAllUsersWithCollaborators()
      if (response) {
        const existingCollaborators = response.collaborators
          .filter((collab) => collab.submissionId === submissionId)
          .map((collab) => collab.userId)
        return existingCollaborators
      }

      return []
    },
  })
  const { data: NonCollaborators, isLoading: loadingNonCollaborators } = useQuery({
    queryKey: ["NonCollaborators", submissionId],
    queryFn: async () => {
      const response = await getAllUsersWithCollaborators()
      if (response) {
        const allUsers = response.users.map((user) => ({
          value: user.id,
          label: user.name,
        }))
        return allUsers
      }

      return []
    },
  })

  useEffect(() => {
    if (!loadingCollaborators && !loadingNonCollaborators && CurrentCollaborators) {
      setSelectedUsers(CurrentCollaborators)
    }
  }, [loadingCollaborators, loadingNonCollaborators, CurrentCollaborators])

  const handleChange = (newValue: any) => {
    setSelectedUsers(newValue.map((user: { value: string; label: string | null }) => user.value))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    const update = await updateFormAccess(selectedUsers, submissionId as string)
    if (update) {
      toast({
        title: "Collaborators updated",
        description: "submission access has been updated.",
      })
      queryClient.invalidateQueries({
        queryKey: ["currentCollaborators", submissionId],
      })
      queryClient.invalidateQueries({
        queryKey: ["NonCollaborators", submissionId],
      })
      queryClient.invalidateQueries({
        queryKey: ["submissionswithformaccess", formId],
      })
    }
    setIsOpen(false)
    setIsLoading(false)
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
          <DialogTitle>Add Collaborators</DialogTitle>
          <DialogDescription>
            Select users to add as collaborators for this submission.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col items-end justify-end space-y-4">
          <Select
            isMulti
            className="w-full border text-sm h-[35px] rounded-none"
            classNamePrefix="bg-transparent"
            placeholder="Select users"
            onChange={handleChange}
            name="categories"
            value={NonCollaborators?.filter((user) => selectedUsers.includes(user.value))}
            options={NonCollaborators}
            styles={{
              control: (provided) => ({
                ...provided,
                outline: "none",
                paddingBottom: "3px",
                border: "none",
                backgroundColor: "transparent",
                boxShadow: "none",
                ":hover": { borderColor: "#aaa" },
              }),
              option: (provided) => ({
                ...provided,
                color: "#000000",
              }),
            }}
          />
        </div>
        <div>
          {!loadingCollaborators || !loadingNonCollaborators ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Current Collaborators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-none space-y-3">
                  {CurrentCollaborators?.map((userId) => (
                    <li key={userId} className="flex items-center">
                      <span>{NonCollaborators?.find((user) => user.value === userId)?.label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <CardSkeleton />
          )}
        </div>
        <DialogFooter>
          <LoadingButton loading={isLoading} variant="default" type="submit" onClick={handleSubmit}>
            <span>Submit</span>
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
