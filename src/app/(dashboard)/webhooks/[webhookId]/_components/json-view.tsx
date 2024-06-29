"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { JsonValue } from "@prisma/client/runtime/library";
import type React from "react";
import ReactJson from "react-json-view";

interface JsonDialogProps {
  jsonData: JsonValue;
}

const JsonDialog: React.FC<JsonDialogProps> = ({ jsonData }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="decoration-muted-foreground truncate underline decoration-dashed underline-offset-4 cursor-pointer">
          View JSON
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>JSON Data</DialogTitle>
        </DialogHeader>
        <ReactJson src={JSON.parse(jsonData as string)} theme="monokai" />
      </DialogContent>
    </Dialog>
  );
};

export default JsonDialog;
