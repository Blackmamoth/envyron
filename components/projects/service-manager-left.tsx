import { EnvVariable, Service } from "@/db/schema";
import { getServicesQueryOptions } from "@/lib/queryOptions/service";
import { useQuery } from "@tanstack/react-query";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

type VariableConfig = Record<
  string,
  Record<string, { included: boolean; required: boolean }>
>;

type Props = {
  projectItems: Service[];
  setProjectItems: React.Dispatch<SetStateAction<Service[]>>;
  serviceVariables: Record<string, EnvVariable[]>;
  variableConfigs: VariableConfig;
  setVariableConfigs: React.Dispatch<SetStateAction<VariableConfig>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<SetStateAction<string>>;
  enabledServices: string[];
  setEnabledServices: React.Dispatch<SetStateAction<string[]>>;
  addModalOpen: boolean;
  setAddModalOpen: React.Dispatch<SetStateAction<boolean>>;
};

export function ServiceManagerLeftSidebar({
  projectItems,
  setProjectItems,
  serviceVariables,
  variableConfigs,
  setVariableConfigs,
  searchQuery,
  setSearchQuery,
  enabledServices,
  setEnabledServices,
  addModalOpen,
  setAddModalOpen,
}: Props) {
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const newConfigs: Record<
      string,
      Record<string, { included: boolean; required: boolean }>
    > = {};

    projectItems.forEach((item) => {
      if (serviceVariables[item.id]) {
        newConfigs[item.id] = {};
        serviceVariables[item.id].forEach((variable) => {
          newConfigs[item.id][variable.key] = {
            included:
              variableConfigs[item.id]?.[variable.key]?.included ?? true,
            required:
              variableConfigs[item.id]?.[variable.key]?.required ?? true,
          };
        });
      }
    });

    setVariableConfigs(newConfigs);
  }, [projectItems, serviceVariables]);

  const serviceQuery = useQuery(getServicesQueryOptions());
  const services = serviceQuery?.data?.services || [];

  const availableServices = services.filter(
    (service) =>
      !projectItems.some((projectItem) => projectItem.id === service.id),
  );

  const filteredItems = availableServices.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleItem = (id: string) => {
    setEnabledServices((prev) => {
      if (prev.includes(id)) {
        return prev.filter((s) => s !== id);
      }
      return [...prev, id];
    });
  };

  const addItem = (item: Service) => {
    setProjectItems((items) => [...items, { ...item, enabled: true }]);
    setAddModalOpen(false);
    setSearchQuery("");
  };

  const toggleVariableIncluded = (serviceId: string, variableName: string) => {
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
  };

  const toggleVariableRequired = (serviceId: string, variableName: string) => {
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
  };

  const toggleServiceExpansion = (serviceName: string) => {
    setExpandedServices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serviceName)) {
        newSet.delete(serviceName);
      } else {
        newSet.add(serviceName);
      }
      return newSet;
    });
  };

  return (
    <div className="w-80 bg-[#0B1437] border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Services</h2>

        {projectItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No services added yet.</p>
            <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#006D77] hover:bg-[#83C5BE] text-white">
                  Add your first service
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0B1437] border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Add Service</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search services and templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[#050A1C] border-gray-600 text-white"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#050A1C] hover:bg-gray-800 transition-colors"
                      >
                        <div>
                          <h3 className="font-medium font-mono">{item.name}</h3>
                          <p className="text-sm text-gray-400">
                            {item.description}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addItem(item)}
                          className="bg-[#006D77] hover:bg-[#83C5BE] text-white"
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-3">
            {projectItems.map((item) => (
              <div key={item.id} className="space-y-2">
                <div
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-[#006D77]/10 transition-colors group ${
                    !enabledServices.includes(item.id) ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => toggleServiceExpansion(item.name)}
                      className="p-1 hover:bg-[#006D77]/20 rounded transition-colors"
                    >
                      {expandedServices.has(item.name) ? (
                        <ChevronDown className="h-4 w-4 text-[#83C5BE]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <h3 className={`font-medium font-mono`}>{item.name}</h3>
                      <p className="text-xs text-gray-400 capitalize">
                        service
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={enabledServices.includes(item.id)}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="data-[state=checked]:bg-[#006D77]"
                  />
                </div>

                {enabledServices.includes(item.id) &&
                  serviceVariables[item.id] &&
                  expandedServices.has(item.name) && (
                    <div className="ml-3 mt-3 space-y-1">
                      <div className="flex items-center gap-2 px-3 py-1">
                        <div className="w-1 h-4 bg-[#006D77] rounded-full"></div>
                        <h4 className="text-xs font-medium text-[#83C5BE] uppercase tracking-wide">
                          Environment Variables
                        </h4>
                      </div>

                      <div className="space-y-1 pl-2">
                        {serviceVariables[item.id].map((variable) => {
                          const isIncluded =
                            variableConfigs[item.id]?.[variable.key]
                              ?.included !== false;
                          const isRequired =
                            variableConfigs[item.id]?.[variable.key]
                              ?.required !== false;

                          return (
                            <div
                              key={variable.key}
                              className={`flex items-center justify-between py-2 px-3 rounded-md transition-all duration-200 group hover:bg-[#006D77]/10 ${
                                !isIncluded
                                  ? "opacity-40"
                                  : "hover:shadow-sm hover:shadow-[#006D77]/20"
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Checkbox
                                  checked={isIncluded}
                                  onCheckedChange={() =>
                                    toggleVariableIncluded(
                                      item.id,
                                      variable.key,
                                    )
                                  }
                                  className="data-[state=checked]:bg-[#006D77] data-[state=checked]:border-[#006D77] shrink-0"
                                />
                                <span
                                  className={`text-sm font-mono font-medium transition-all duration-200 truncate ${
                                    isIncluded
                                      ? "text-white group-hover:text-[#83C5BE]"
                                      : "text-gray-500 line-through"
                                  }`}
                                >
                                  {variable.key}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-gray-400 font-medium">
                                  Required
                                </span>
                                <Switch
                                  checked={isRequired}
                                  onCheckedChange={() =>
                                    toggleVariableRequired(
                                      item.id,
                                      variable.key,
                                    )
                                  }
                                  className="data-[state=checked]:bg-[#006D77] scale-75"
                                  disabled={!isIncluded}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Button */}
      {availableServices.length > 0 && (
        <div className="p-6">
          <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-[#006D77] hover:bg-[#83C5BE] text-white">
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0B1437] border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Add Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search services and templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#050A1C] border-gray-600 text-white"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#050A1C] hover:bg-gray-800 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium font-mono">{item.name}</h3>
                        <p className="text-sm text-gray-400">
                          {item.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addItem(item)}
                        className="bg-[#006D77] hover:bg-[#83C5BE] text-white"
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
