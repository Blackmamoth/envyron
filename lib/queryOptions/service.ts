import { Service } from "@/db/schema";
import { CreateItemSchema, UpdateServiceSchema } from "@/validation/service";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

const createService = async (
  body: CreateItemSchema,
): Promise<{ message: string; service: { id: string; name: string } }> => {
  const response = await fetch("/api/service", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to create service");
  }

  return { message: resBody?.message, service: resBody?.service };
};

const getServices = async (): Promise<{
  message: string;
  services: Service[];
}> => {
  const response = await fetch("/api/service");

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to fetch services");
  }
  return { message: resBody?.message, services: resBody.services };
};

const getService = async (
  id: string,
): Promise<{ service: Service; message: string }> => {
  const response = await fetch(`/api/service/${id}`);

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to fetch service");
  }

  return { service: resBody?.service, message: resBody?.message };
};

const updateService = async (
  updateServiceData: UpdateServiceSchema,
): Promise<{ message: string }> => {
  const response = await fetch("/api/service", {
    method: "PATCH",
    body: JSON.stringify(updateServiceData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to update service");
  }

  return { message: resBody?.message };
};

export const createServiceQueryOptions = () =>
  mutationOptions({
    mutationKey: ["services", "create"],
    mutationFn: createService,
  });

export const getServicesQueryOptions = () =>
  queryOptions({
    queryKey: ["services"],
    queryFn: getServices,
  });

export const getServiceQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["service", id],
    queryFn: () => getService(id),
  });

export const updateServiceQueryOptions = () =>
  mutationOptions({
    mutationKey: ["services", "update"],
    mutationFn: updateService,
  });
