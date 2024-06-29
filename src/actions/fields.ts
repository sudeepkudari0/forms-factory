"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import type { Field, fieldType } from "@prisma/client"

type InsertField = {
  label: string
  description?: string | undefined
  type: fieldType | null
  placeholder?: string | undefined
  required: boolean
  options: string | undefined
  formId: string
}
export async function addField(values: InsertField) {
  const data = await db.field.create({ data: { ...values } })

  revalidatePath(`/forms/${values.formId}/edit`)
  return data
}

type MultiOption = {
  label: string;
  value: string;
  disable?: boolean;
};

type FormType = {
  id: string;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
  type: string;
  formId?: string;
  options: string[];
  multi_options: MultiOption[];
};


interface UpdateField {
  id: string
  label?: string
  description?: string
  type: fieldType
  placeholder?: string
  required?: boolean
  formId?: string
  options?: string
  multi_options?: MultiOption[];
  saved?: boolean
  order?: number | null
  createdAt?: Date
  updatedAt?: Date
}


export async function updateField(values: UpdateField) {
  if (!values.id) {
    throw new Error("values id is required");
  }

  const { id, multi_options, ...updateValues } = values;

  delete updateValues.createdAt;
  delete updateValues.updatedAt;

  try {
    const data: any = {
      ...updateValues,
      multipleOptions: multi_options ? JSON.stringify(multi_options) : null,
    };

    const updatedField = await db.field.update({
      where: { id },
      data,
    });

    revalidatePath(`/forms/${values.formId}/edit`);
    return updatedField;
  } catch (error) {
    console.error("Error updating field:", error);
    throw new Error("Failed to update field");
  } finally {
    await db.$disconnect();
  }
}

export async function deleteField(id: string) {
  const field = await db.field.findFirst({
    where: {
      id: id,
    },
  })
  if (!field) {
    throw new Error("Field not found")
  }

  await db.field.delete({ where: { id } })

  revalidatePath(`/forms/${field.formId}/edit`)
}

export async function updateReorderFields(values: Field[]) {
  try {
    const updatePromises = values.map((field, index) =>
      db.field.update({
        where: { id: field.id },
        data: { order: index },
      })
    )

    const updatedFields = await Promise.all(updatePromises)
    return updatedFields
  } catch (error) {
    console.log(error)
    throw error
  }
}
