import { getCurrentUser } from "@/lib/session";
import { UserRole, UserStatus } from "@prisma/client";
import Image from "next/image";
import { redirect } from "next/navigation";
import authImage from "../../../../public/auth-image.png";
interface UserLayoutProps {
  children?: React.ReactNode;
}

export default async function InviteLayout({ children }: UserLayoutProps) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return redirect("/login");
  }
  if (user?.role !== UserRole.USER) {
    return redirect("/onboarding");
  }
  if (user?.status !== UserStatus.ACTIVE) {
    return redirect("/unauthorized");
  }

  return (
    <div className="relative max-h-screen">
      <Image
        src={authImage}
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-[-1] blur-md"
      />
      <div>{children}</div>
    </div>
  );
}
