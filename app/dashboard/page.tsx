import DashboardContent from "@/components/dashboard/content";
import DashboardHeader from "@/components/dashboard/header";

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <DashboardHeader />
      <DashboardContent />
    </main>
  );
}
