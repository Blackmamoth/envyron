import {
  deleteServiceMutationOptions,
  getServiceQueryOptions,
  getServicesQueryOptions,
  updateServiceMutationOptions,
} from "@/lib/queryOptions/service";
import type { DeleteItemSchema, UpdateItemSchema } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useFetchServices = () => {
  const query = useQuery({
    ...getServicesQueryOptions(),
    select: (data) => {
      if (!data) return [];
      if (Array.isArray(data?.services)) return data.services;
      return [];
    },
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message);
    }
  }, [query.isError, query.error]);

  return { services: query.data ?? [], ...query };
};

export const useFetchService = (serviceId: string) => {
  const query = useQuery({
    ...getServiceQueryOptions(serviceId),
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message);
    }
  }, [query.isError, query.error]);

  return { service: query.data?.service, ...query };
};

export const useUpdateService = (serviceId: string) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const mutation = useMutation({
    ...updateServiceMutationOptions(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["service", serviceId] });
      setIsEditing(false);
      toast.success(data.message);
    },
    onError: (error) => {
      setIsEditing(false);
      toast.error(error.message);
    },
  });

  const updateService = (data: UpdateItemSchema) => {
    setIsEditing(true);
    mutation.mutate(data);
  };

  return { updateService, isEditing, setIsEditing, ...mutation };
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...deleteServiceMutationOptions(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteService = (data: DeleteItemSchema) => {
    mutation.mutate(data);
  };

  return { deleteService, ...mutation };
};
