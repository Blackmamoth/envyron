import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type {
  Service,
  CreateItemSchema,
  DeleteItemSchema,
  UpdateItemSchema,
} from "@/types";

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

const deleteService = async ({
  id,
}: DeleteItemSchema): Promise<{ message: string }> => {
  const response = await fetch("/api/service", {
    method: "DELETE",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to delete service");
  }

  return { message: resBody?.message };
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
  updateServiceData: UpdateItemSchema,
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

export const createServiceMutationOptions = () =>
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

export const updateServiceMutationOptions = () =>
  mutationOptions({
    mutationKey: ["services", "update"],
    mutationFn: updateService,
  });

export const deleteServiceMutationOptions = () =>
  mutationOptions({
    mutationKey: ["service", "delete"],
    mutationFn: deleteService,
  });
