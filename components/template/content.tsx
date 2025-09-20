"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Save, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { EnvVariable, Service } from "@/db/schema";
import { getServicesQueryOptions } from "@/lib/queryOptions/service";
import {
  getTemplateCompositionQueryOptions,
  syncTemplateMutationOptions,
} from "@/lib/queryOptions/template";
import { type SyncTemplateSchema, syncTemplateSchema } from "@/lib/validation";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { getServiceVariables } from "@/lib/utils";

type Props = {
  templateId: string;
};

export function TemplateContent({ templateId }: Props) {
  const queryClient = useQueryClient();

  const serviceQuery = useQuery(getServicesQueryOptions());

  const compositionQuery = useQuery(
    getTemplateCompositionQueryOptions(templateId),
  );

  const services = serviceQuery.data?.services || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedServices, setExpandedServices] = useState<string[]>([]);
  const [serviceVariables, setServiceVariables] = useState<
    Record<string, EnvVariable[]>
  >({});

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isValid, isDirty },
  } = useForm({
    resolver: zodResolver(syncTemplateSchema),
    defaultValues: { services: [] },
  });

  const selectedServices = watch("services");

  const { mutate } = useMutation({
    ...syncTemplateMutationOptions(templateId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["templates", templateId, "sync"],
      });
      toast.success(response.message);
      reset({ services: selectedServices });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service?.description?.toLowerCase()?.includes(searchQuery.toLowerCase()),
  );

  const handleServiceToggle = async (service: Service) => {
    const isSelected = selectedServices.find((s) => s === service.id);
    if (isSelected) {
      setValue(
        "services",
        selectedServices.filter((s) => s !== service.id),
        { shouldDirty: true },
      );
    } else {
      setValue("services", [...selectedServices, service.id], {
        shouldDirty: true,
      });
      if (!serviceVariables[service.id]) {
        await getServiceVariables(queryClient, service.id, setServiceVariables);
      }
    }
  };

  const handleSync = async (data: SyncTemplateSchema) => {
    mutate(data);
  };

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const selectedServiceData = services.filter((service) =>
    selectedServices.find((s) => s === service.id),
  );

  useEffect(() => {
    if (compositionQuery.data?.compositions?.length) {
      const servicesToSet = compositionQuery.data.compositions.map(
        (c) => c.service,
      );

      setValue("services", servicesToSet, { shouldDirty: false });

      Promise.all(
        compositionQuery.data.compositions.map(async (composition) => {
          await getServiceVariables(
            queryClient,
            composition.service,
            setServiceVariables,
          );
        }),
      );
    }
  }, [compositionQuery.data, setValue, queryClient]);

  return (
    <>
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Service Selector */}
        <div className="w-2/5 border-r border-gray-800 bg-[#0F1B4C]/50 p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search services…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1A2B5C] border-gray-700 text-white placeholder-gray-400 focus:border-[#006D77]"
              />
            </div>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:border-[#006D77] hover:shadow-lg hover:shadow-[#006D77]/20 ${selectedServices.includes(service.id)
                  ? "bg-[#006D77]/15 border-[#006D77]"
                  : "bg-[#1A2B5C] border-gray-700"
                  }`}
                onClick={() => handleServiceToggle(service)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedServices.includes(service.id)}
                    onChange={() => handleServiceToggle(service)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Live Summary */}
        <div className="flex-1 p-6 bg-[#0B1437]">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Template Preview
            </h2>
          </div>

          {selectedServiceData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-[#1A2B5C] rounded-lg flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">
                No services selected yet
              </p>
              <p className="text-gray-500 text-sm">
                Start by choosing services on the left.
              </p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              {selectedServiceData.map((service) => (
                <div
                  key={service.id}
                  className="bg-[#1A2B5C] rounded-lg border border-gray-700"
                >
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#1A2B5C]/80 transition-colors"
                    onClick={() => toggleServiceExpansion(service.id)}
                  >
                    <div>
                      <h3 className="font-semibold text-white">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {service.description}
                      </p>
                    </div>
                    {expandedServices.includes(service.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {expandedServices.includes(service.id) && (
                    <div className="px-4 pb-4 border-t border-gray-700">
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">
                          Environment Variables
                        </h4>

                        <div className="space-y-3">
                          {/* header row */}
                          <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-gray-400 border-b border-gray-700 pb-2">
                            <div>Key</div>
                            <div>Default Value</div>
                            <div>Required</div>
                          </div>

                          {/* data rows */}
                          {serviceVariables[service.id].map((envVar) => (
                            <div
                              key={envVar.id}
                              className="grid grid-cols-3 gap-4 text-sm"
                            >
                              <div>
                                <span className="font-mono text-[#83C5BE]">
                                  {envVar.key}
                                </span>
                              </div>
                              <div>
                                <span className="font-mono text-gray-300">
                                  {envVar.defaultValue}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">
                                  {envVar.required ? "Yes" : "No"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0B1437]/95 backdrop-blur-sm border-t border-gray-800 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSubmit(handleSync)}
            className="bg-[#006D77] hover:bg-[#83C5BE] text-white transition-all duration-200 shadow-lg hover:shadow-[#006D77]/30"
            disabled={!isValid || !isDirty}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>
    </>
  );
}
