"use client";
import type { EnvVariable, Service } from "@envyron/types";
import { getServiceVariables } from "@/lib/queryOptions";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { ServiceManagerLeftSidebar } from "./service-manager-left";
import { ServiceManagerRightPanel } from "./service-manager-right";
import { useFetchServices } from "@/hooks/use-service";
import { useFetchProjectComposition } from "@/hooks/use-project";

type Props = {
  projectId: string;
};

type VariableConfigs = Record<
  string,
  Record<string, { included: boolean; required: boolean }>
>;

export function ServiceManager({ projectId }: Props) {
  const [projectItems, setProjectItems] = useState<Service[]>([]);
  const [enabledServices, setEnabledServices] = useState<string[]>([]);
  const [serviceVariables, setServiceVariables] = useState<
    Record<string, EnvVariable[]>
  >({});
  const [variableConfigs, setVariableConfigs] = useState<VariableConfigs>({});

  const loadingServicesRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef(false);

  const queryClient = useQueryClient();
  const { services, isLoading: servicesLoading } = useFetchServices();
  const { compositions: projectCompositions, isLoading: compositionsLoading } =
    useFetchProjectComposition(projectId);

  const compositionServiceIds = useMemo(
    () => projectCompositions.map((comp) => comp.service),
    [projectCompositions],
  );

  const projectServices = useMemo(
    () =>
      services.filter((service) => compositionServiceIds.includes(service.id)),
    [services, compositionServiceIds],
  );

  const loadServiceVariables = useCallback(
    async (serviceIds: string[]) => {
      const promises = serviceIds
        .filter((id) => !loadingServicesRef.current.has(id))
        .map(async (serviceId) => {
          loadingServicesRef.current.add(serviceId);
          try {
            await getServiceVariables(
              queryClient,
              serviceId,
              setServiceVariables,
            );
          } catch (error) {
            console.error(
              `Failed to load variables for service ${serviceId}:`,
              error,
            );
          } finally {
            loadingServicesRef.current.delete(serviceId);
          }
        });

      await Promise.allSettled(promises);
    },
    [queryClient],
  );

  useEffect(() => {
    if (servicesLoading || compositionsLoading) return;

    if (!projectCompositions.length && projectItems.length > 0) {
      setProjectItems([]);
      setEnabledServices([]);
      setServiceVariables({});
      setVariableConfigs({});
      return;
    }

    if (!isInitializedRef.current) {
      setProjectItems(projectServices);
      setEnabledServices(compositionServiceIds);

      if (compositionServiceIds.length > 0) {
        loadServiceVariables(compositionServiceIds);
      }

      isInitializedRef.current = true;
    }
  }, [
    projectCompositions,
    services,
    compositionServiceIds,
    projectServices,
    servicesLoading,
    compositionsLoading,
    loadServiceVariables,
  ]);

  // Memoized callbacks to prevent child component re-renders
  const handleSetProjectItems = useCallback(
    (updater: React.SetStateAction<Service[]>) => {
      setProjectItems(updater);
    },
    [],
  );

  const handleSetEnabledServices = useCallback(
    (updater: React.SetStateAction<string[]>) => {
      setEnabledServices(updater);
    },
    [],
  );

  const handleSetServiceVariables = useCallback(
    (updater: React.SetStateAction<Record<string, EnvVariable[]>>) => {
      setServiceVariables(updater);
    },
    [],
  );

  const handleSetVariableConfigs = useCallback(
    (updater: React.SetStateAction<VariableConfigs>) => {
      setVariableConfigs(updater);
    },
    [],
  );

  if ((servicesLoading || compositionsLoading) && !isInitializedRef.current) {
    return (
      <div className="flex h-[calc(100vh-73px)] items-center justify-center">
        <div className="text-gray-400">Loading project services...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Left Sidebar - Service Manager */}
      <ServiceManagerLeftSidebar
        projectId={projectId}
        enabledServices={enabledServices}
        setEnabledServices={handleSetEnabledServices}
        projectItems={projectItems}
        setProjectItems={handleSetProjectItems}
        variableConfigs={variableConfigs}
        setVariableConfigs={handleSetVariableConfigs}
        serviceVariables={serviceVariables}
        setServiceVariables={handleSetServiceVariables}
      />

      {/* Right Panel - Preview Panel */}
      <ServiceManagerRightPanel
        enabledServices={enabledServices}
        projectItems={projectItems}
        serviceVariables={serviceVariables}
        variableConfigs={variableConfigs}
      />
    </div>
  );
}
