import ServiceBody from "@/components/service/content";
import ServiceHeader from "@/components/service/header";

export default async function ServiceEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#0B1437] text-white">
      <ServiceHeader serviceId={id} />
      <ServiceBody serviceId={id} />
    </div>
  );
}
