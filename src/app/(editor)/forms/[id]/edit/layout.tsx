import { Footer } from "@/components/layout/footer"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

interface EditorProps {
  children?: React.ReactNode
}

export default async function EditorLayout({ children }: EditorProps) {
  const user = await getCurrentUser()

  if (!user) {
    return redirect("/login")
  }
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <div className="container mx-auto grid flex-1 items-start gap-10 py-8">{children}</div>
      <Footer />
    </div>
  )
}
