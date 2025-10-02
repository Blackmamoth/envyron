import ServiceBody from "@/components/service/content";
import ServiceHeader from "@/components/service/header";
import { auth } from "@envyron/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ServiceEditor({
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
      <ServiceHeader serviceId={id} />
      <ServiceBody serviceId={id} />
    </div>
  );
}
