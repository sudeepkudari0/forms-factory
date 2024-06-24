import { getForm } from "@/actions/forms"
import { Editor } from "@/components/editor"
import { getCurrentUser } from "@/lib/session"

const EditForm = async ({ params: { id } }: { params: { id: string } }) => {
  const form = await getForm({ id })
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return <Editor form={form} />
}

export default EditForm
