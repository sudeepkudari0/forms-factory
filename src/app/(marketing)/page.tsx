import { Hero } from "@/components/hero";
import { getCurrentUser } from "@/lib/session";

export default async function IndexPage() {
  const user = await getCurrentUser();
  
  return <Hero isLoggedIn={!!user} />;
}
