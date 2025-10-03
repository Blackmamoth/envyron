import { ProjectsHeader } from "@/components/projects/header";
import { ServiceManager } from "@/components/projects/service-manager";
import { auth } from "@envyron/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProjectWorkspace({
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

  const { id: projectId } = await params;

  return (
    <div className="min-h-screen bg-[#050A1C] text-white">
      {/* Header */}
      <ProjectsHeader projectId={projectId} />

      <ServiceManager projectId={projectId} />
    </div>
  );
}
