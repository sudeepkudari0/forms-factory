import { db } from "@/lib/db"

const getForm = async ({ id }: { id: string }) => {
  const form = await db.form.findFirst({
    where: { id },
    include: { submissions: true },
  })

  if (!form) {
    throw new Error("Form not found")
  }

  return form
}

const FormSettings = async ({ params: { id } }: { params: { id: string } }) => {
  const _form = await getForm({ id })

  return <div className="py-8">Settings</div>
}

export default FormSettings
