import { deleteApiKey } from "@/actions/api-key";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "@/components/ui/use-toast";
import type { ApiKey } from "@prisma/client";
import React, { useState } from "react";

export const DeleteApiKeyDialog = ({
  trigger,
  apiKey,
}: {
  trigger: React.ReactElement;
  apiKey: ApiKey;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleKeyDelete = async ({ apikey }: { apikey: ApiKey }) => {
    setLoading(true);
    await deleteApiKey(apikey.id);
    toast({
      title: "Api key deleted",
      description: "key has been deleted.",
    });
    setLoading(false);
    setIsOpen(false);
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        {React.cloneElement(trigger, {
          onClick: () => setIsOpen(true),
        })}
      </DialogTrigger>
      <DialogContent className="rounded sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete ApiKey</DialogTitle>
          <DialogDescription>
            Once done this action cannot be undone
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            type="submit"
            loading={loading}
            className="w-full font-medium bg-red-600 rounded  text-white  hover:bg-red-700"
            onClick={() => handleKeyDelete({ apikey: apiKey })}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
