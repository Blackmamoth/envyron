import type { EnvVariable, Service } from "@/db/schema";
import {
  type SetStateAction,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFetchServices } from "@/hooks/use-service";
import { useSyncProjects } from "@/hooks/use-project";
import { AddServiceModal } from "./add-service-modal";
import { ServiceItems } from "./service-items";

type VariableConfig = Record<
  string,
  Record<string, { included: boolean; required: boolean }>
>;

type Props = {
  projectId: string;
  projectItems: Service[];
  setProjectItems: React.Dispatch<SetStateAction<Service[]>>;
  serviceVariables: Record<string, EnvVariable[]>;
  setServiceVariables: React.Dispatch<
    SetStateAction<Record<string, EnvVariable[]>>
  >;
  variableConfigs: VariableConfig;
  setVariableConfigs: React.Dispatch<SetStateAction<VariableConfig>>;
  enabledServices: string[];
  setEnabledServices: React.Dispatch<SetStateAction<string[]>>;
};

export function ServiceManagerLeftSidebar({
  projectId,
  projectItems,
  setProjectItems,
  serviceVariables,
  setServiceVariables,
  variableConfigs,
  setVariableConfigs,
  enabledServices,
  setEnabledServices,
}: Props) {
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set(),
  );
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [removeOpen, setRemoveOpen] = useState(false);
  const [servicePendingRemoval, setServicePendingRemoval] =
    useState<Service | null>(null);

  const { services } = useFetchServices();
  const { mutate, fetchServiceVariables } = useSyncProjects(projectId);

  const availableServices = useMemo(
    () =>
      services.filter(
        (service) =>
          !projectItems.some((projectItem) => projectItem.id === service.id),
      ),
    [services, projectItems],
  );

  // Sync variable configs when dependencies change
  useEffect(() => {
    const newConfigs: VariableConfig = {};

    projectItems.forEach((item) => {
      const variables = serviceVariables[item.id];
      if (variables) {
        newConfigs[item.id] = {};
        variables.forEach((variable) => {
          newConfigs[item.id][variable.key] = {
            included:
              variableConfigs[item.id]?.[variable.key]?.included ?? true,
            required:
              variableConfigs[item.id]?.[variable.key]?.required ??
              variable.required,
          };
        });
      }
    });

    setVariableConfigs(newConfigs);
  }, [projectItems, serviceVariables]);

  const toggleService = useCallback(
    (id: string) => {
      setEnabledServices((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
      );
    },
    [setEnabledServices],
  );

  const addService = useCallback(
    (service: Service) => {
      setProjectItems((items) => [...items, service]);
      setAddModalOpen(false);
      setSearchQuery("");

      const serviceIds = [...projectItems.map((i) => i.id), service.id];
      mutate({ services: serviceIds });
      fetchServiceVariables(service.id, setServiceVariables);
      setEnabledServices((prev) => [...prev, service.id]);
    },
    [
      projectItems,
      mutate,
      fetchServiceVariables,
      setProjectItems,
      setServiceVariables,
      setEnabledServices,
    ],
  );

  const toggleVariableIncluded = useCallback(
    (serviceId: string, variableName: string) => {
      setVariableConfigs((configs) => ({
        ...configs,
        [serviceId]: {
          ...configs[serviceId],
          [variableName]: {
            ...configs[serviceId][variableName],
            included: !configs[serviceId][variableName].included,
          },
        },
      }));
    },
    [setVariableConfigs],
  );

  const toggleVariableRequired = useCallback(
    (serviceId: string, variableName: string) => {
      setVariableConfigs((configs) => ({
        ...configs,
        [serviceId]: {
          ...configs[serviceId],
          [variableName]: {
            ...configs[serviceId][variableName],
            required: !configs[serviceId][variableName].required,
          },
        },
      }));
    },
    [setVariableConfigs],
  );

  const toggleServiceExpansion = useCallback((serviceId: string) => {
    setExpandedServices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  }, []);

  const requestRemoveService = useCallback((service: Service) => {
    setServicePendingRemoval(service);
    setRemoveOpen(true);
  }, []);

  const cancelRemoveService = useCallback(() => {
    setRemoveOpen(false);
    setServicePendingRemoval(null);
  }, []);

  const confirmRemoveService = useCallback(() => {
    if (!servicePendingRemoval) return;

    const serviceId = servicePendingRemoval.id;

    setProjectItems((items) => items.filter((i) => i.id !== serviceId));
    setVariableConfigs((prev) => {
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });
    setExpandedServices((prev) => {
      const next = new Set(prev);
      next.delete(serviceId);
      return next;
    });
    setEnabledServices((prev) => prev.filter((id) => id !== serviceId));

    const remainingServiceIds = projectItems
      .filter((p) => p.id !== serviceId)
      .map((i) => i.id);
    mutate({ services: remainingServiceIds });

    setRemoveOpen(false);
    setServicePendingRemoval(null);
  }, [
    servicePendingRemoval,
    projectItems,
    mutate,
    setProjectItems,
    setVariableConfigs,
    setExpandedServices,
    setEnabledServices,
  ]);

  const hasNoServices = projectItems.length === 0;
  const hasAvailableServices = availableServices.length > 0;

  return (
    <div className="w-80 bg-[#0B1437] border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Services</h2>

        {hasNoServices ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No services added yet.</p>
            <AddServiceModal
              isOpen={addModalOpen}
              onOpenChange={setAddModalOpen}
              availableServices={availableServices}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddService={addService}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {projectItems.map((item) => (
              <ServiceItems
                key={item.id}
                item={item}
                isEnabled={enabledServices.includes(item.id)}
                isExpanded={expandedServices.has(item.name)}
                serviceVariables={serviceVariables[item.id] || []}
                variableConfigs={variableConfigs[item.id] || {}}
                onToggleService={() => toggleService(item.id)}
                onToggleExpansion={() => toggleServiceExpansion(item.name)}
                onRemoveService={() => requestRemoveService(item)}
                onToggleVariableIncluded={(variableName) =>
                  toggleVariableIncluded(item.id, variableName)
                }
                onToggleVariableRequired={(variableName) =>
                  toggleVariableRequired(item.id, variableName)
                }
              />
            ))}
          </div>
        )}
      </div>

      {hasAvailableServices && !hasNoServices && (
        <div className="p-6">
          <AddServiceModal
            isOpen={addModalOpen}
            onOpenChange={setAddModalOpen}
            availableServices={availableServices}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddService={addService}
          />
        </div>
      )}

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent className="bg-[#0B1437] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Remove Service</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to remove{" "}
              {servicePendingRemoval?.name ?? "this service"} from this project?
              This action only affects this project.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={cancelRemoveService}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRemoveService}
              className="bg-[var(--envyron-destructive)] hover:bg-[color:var(--envyron-destructive)]/90 text-white"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
