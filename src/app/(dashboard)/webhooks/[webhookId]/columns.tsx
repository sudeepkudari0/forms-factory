"use client";

import { DataTableColumnHeader } from "@/components/ui/data-column-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type { WebhookEvent } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import JsonDialog from "./_components/json-view";

export const columns: ColumnDef<WebhookEvent>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const event = row.original;

      return (
        <StatusBadge
          className="capitalize"
          variant={
            event.status === "success"
              ? "success"
              : event.status === "failed"
              ? "error"
              : "default"
          }
        >
          {event.status}
        </StatusBadge>
      );
    },
  },
  {
    accessorKey: "eventType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event type" />
    ),
    cell: ({ row }) => {
      const event = row.original;

      return <div>{event.eventType}</div>;
    },
  },
  {
    accessorKey: "eventData",
    header: "Event data",
    cell: ({ row }) => {
      const eventData = row.original.eventData;

      return <JsonDialog jsonData={eventData} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => {
      const form = row.original;

      return <div>{dayjs(form.createdAt).format("MMM D, YYYY - hh:mm")}</div>;
    },
  },
  {
    accessorKey: "statusCode",
    header: "Status Code",
    cell: ({ row }) => {
      const event = row.original;

      return (
        <StatusBadge
          className="capitalize"
          variant={event.statusCode === 200 ? "success" : "error"}
        >
          {event.statusCode}
        </StatusBadge>
      );
    },
  },
  {
    accessorKey: "attemptCount",
    header: "Attempts",
  },
];
