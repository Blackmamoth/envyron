import { TemplateContent } from "@/components/template/content";
import { TemplatesHeader } from "@/components/template/header";

export default async function TemplateBuilder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
