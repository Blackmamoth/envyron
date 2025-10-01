import {
  deleteTemplateMutationOptions,
  getTemplateCompositionQueryOptions,
  getTemplateQueryOptions,
  getTemplatesQueryOptions,
  syncTemplateMutationOptions,
  updateTemplateMutationOptions,
} from "@/lib/queryOptions/template";
import type { DeleteItemSchema, UpdateItemSchema } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useFetchTemplates = () => {
  const query = useQuery({
    ...getTemplatesQueryOptions(),
    select: (data) => {
      if (!data) return null;
      if (Array.isArray(data?.templates)) return data.templates;
      return [];
    },
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message);
    }
  }, [query.isError, query.error]);

  return { templates: query.data ?? [], ...query };
};

export const useFetchTemplate = (templateId: string) => {
  const query = useQuery({
    ...getTemplateQueryOptions(templateId),
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message);
    }
  }, [query.isError, query.error]);

  return { template: query.data?.template, ...query };
};

export const useUpdateTemplate = (templateId: string) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const mutation = useMutation({
    ...updateTemplateMutationOptions(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["template", templateId] });
      setIsEditing(false);
      toast.success(data.message);
    },
    onError: (error) => {
      setIsEditing(false);
      toast.error(error.message);
    },
  });

  const updateTemplate = (data: UpdateItemSchema) => {
    setIsEditing(true);
    mutation.mutate(data);
  };

  return { updateTemplate, isEditing, setIsEditing, ...mutation };
};

export const useFetchTemplateComposition = (templateId: string) => {
  const query = useQuery({
    ...getTemplateCompositionQueryOptions(templateId),
    select: (data) => {
      if (!data) return null;
      if (Array.isArray(data?.compositions)) return data.compositions;
      return [];
    },
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message);
    }
  }, [query.isError, query.error]);

  return { compositions: query.data ?? [], ...query };
};

export const useSyncTemplates = (templateId: string) => {
  const queryClient = useQueryClient();

  const syncTemplateMutation = useMutation({
    ...syncTemplateMutationOptions(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["templates", templateId],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return syncTemplateMutation;
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...deleteTemplateMutationOptions(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteTemplate = (data: DeleteItemSchema) => {
    mutation.mutate(data);
  };

  return { deleteTemplate, ...mutation };
};
