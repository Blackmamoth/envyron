import {
  getVariablesQueryOptions,
  syncVariableMutationOptions,
} from "@/lib/queryOptions/envVariable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export const useFetchVariables = (serviceId: string) => {
  const query = useQuery({
    ...getVariablesQueryOptions(serviceId),
    select: (data) => {
      if (!data) return [];
      if (Array.isArray(data?.variables)) return data.variables;
      return [];
    },
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message);
    }
  }, [query.isError, query.error]);

  return { variables: query.data ?? [], ...query };
};

export const useSyncVariables = (serviceId: string) => {
  const queryClient = useQueryClient();

  const syncVariablesMutation = useMutation({
    ...syncVariableMutationOptions(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variables", serviceId] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return syncVariablesMutation;
};
