import { deleteUser } from "@/actions/users"
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
import type { User } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"

export const DeleteUserDialog = ({
  trigger,
  user,
}: {
  trigger: React.ReactElement
  user: User
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient()
  const handleUserDelete = async ({ user }: { user: User }) => {
    setLoading(true);
    const response = await deleteUser({ userId: user.id });
  
    queryClient.invalidateQueries({ queryKey: ["filteredUsers"] });
  
    if (response.success) {
      toast({
        title: 'User deleted',
        description: `User ${response?.data?.name} has been deleted.`,
      });
    } else {
      toast({
        title: 'Error',
        description: `Failed to delete user: ${response.error}`,
      });
    }
  
    setLoading(false);
    setIsOpen(false);
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
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>Once done this action cannot be undone</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            type="submit"
            loading={loading}
            className="w-full font-medium bg-red-600 rounded  text-white  hover:bg-red-700"
            onClick={() => handleUserDelete({ user })}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
