import { TemplateContent } from "@/components/template/content";
import { TemplatesHeader } from "@/components/template/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function TemplateBuilder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#0B1437] text-white">
      {/* Header */}
      <TemplatesHeader templateId={id} />

      {/* Main Content */}
      <TemplateContent templateId={id} />
    </div>
  );
}
