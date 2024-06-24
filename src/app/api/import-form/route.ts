import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import Papa from "papaparse" // Import papaparse for CSV parsing
import * as XLSX from "xlsx"

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const file = data.get("file") as Blob
    const formId = data.get("formId") as string

    if (!formId) {
      return NextResponse.json({ error: "Missing formId" }, { status: 400 })
    }

    let csvData: string
    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      const arrayBuffer = await file.arrayBuffer()
      csvData = new TextDecoder().decode(arrayBuffer)
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.name.endsWith(".xlsx")
    ) {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      csvData = XLSX.utils.sheet_to_csv(worksheet)
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    })

    const fields = parsedData.data.map((row: any) => ({
      label: row.label,
      placeholder: row.placeholder,
      required: row.required === "TRUE",
      description: row.description,
      saved: row.saved === "true",
      order: Number.parseInt(row.order, 10),
      options: row.options,
      type: row.type,
      formId,
    }))

    await db.field.createMany({ data: fields })
    const updated = await db.field.findMany({ where: { formId } })
    return NextResponse.json(
      { message: "CSV data imported successfully", updated: updated },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error importing CSV:", error)
    return NextResponse.json({ error: "Failed to import CSV data" }, { status: 500 })
  }
}
