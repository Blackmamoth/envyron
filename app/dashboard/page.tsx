import DashboardContent from "@/components/dashboard/content";
import DashboardHeader from "@/components/dashboard/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  return (
    <main className="min-h-screen">
      <DashboardHeader />
      <DashboardContent />
    </main>
  );
}
