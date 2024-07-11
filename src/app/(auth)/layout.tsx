import Image from "next/image";
import authImage from "../../../public/auth-image.png";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative max-h-screen">
      <Image
        src={authImage}
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-[-1]"
      />
      <div>{children}</div>
    </div>
  );
}
