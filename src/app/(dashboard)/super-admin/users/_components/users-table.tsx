"use client"

import { DataTable } from "@/components/ui/data-table"
import type { User } from "@prisma/client"
import { columns } from "../columns"

export const SubmissionsTable = ({ users }: { users: User[] }) => {
  return (
    <div className="overflow-hidden">
      <DataTable columns={columns} data={users || []} />
    </div>
  )
}
