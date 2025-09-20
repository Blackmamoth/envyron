import { ProjectsHeader } from "@/components/projects/header";
import { ServiceManager } from "@/components/projects/service-manager";

export default async function ProjectWorkspace({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = await params;

  return (
    <div className="min-h-screen bg-[#050A1C] text-white">
      {/* Header */}
      <ProjectsHeader projectId={projectId} />

      <ServiceManager projectId={projectId} />
    </div>
  );
}
