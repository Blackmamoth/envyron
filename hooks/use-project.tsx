import type { EnvVariable } from "@/db/schema";
import {
  deleteProjectMutationOptions,
  getProjectCompositionQueryOptions,
  getProjectQueryOptions,
  getProjectsQueryOptions,
  syncProjectMutationOptions,
  updateProjectMutationOptions,
} from "@/lib/queryOptions/project";
import { getServiceVariables } from "@/lib/utils";
import type { DeleteItemSchema, UpdateItemSchema } from "@/lib/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

export const useFetchProjects = () => {
  const query = useQuery({
    ...getProjectsQueryOptions(),
    select: (data) => {
      if (!data) return null;
      if (Array.isArray(data?.projects)) return data.projects;
      return [];
    },
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message);
    }
  }, [query.isError, query.error]);

  return { projects: query.data ?? [], ...query };
};

export const useFetchProjectComposition = (projectId: string) => {
  const query = useQuery({
    ...getProjectCompositionQueryOptions(projectId),
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

export const useFetchProject = (projectId: string) => {
  const query = useQuery({
    ...getProjectQueryOptions(projectId),
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message);
    }
  }, [query.isError, query.error]);

  return { project: query.data?.project, ...query };
};

export const useUpdateProject = (projectId: string) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const mutation = useMutation({
    ...updateProjectMutationOptions(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setIsEditing(false);
      toast.success(data.message);
    },
    onError: (error) => {
      setIsEditing(false);
      toast.error(error.message);
    },
  });

  const updateProject = (data: UpdateItemSchema) => {
    setIsEditing(true);
    mutation.mutate(data);
  };

  return { updateProject, isEditing, setIsEditing, ...mutation };
};

export const useSyncProjects = (projectId: string) => {
  const queryClient = useQueryClient();

  const syncProjectMutation = useMutation({
    ...syncProjectMutationOptions(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const fetchServiceVariables = async (
    serviceId: string,
    setServiceVariables: React.Dispatch<
      SetStateAction<Record<string, EnvVariable[]>>
    >,
  ) => {
    await getServiceVariables(queryClient, serviceId, setServiceVariables);
  };

  return { ...syncProjectMutation, fetchServiceVariables };
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...deleteProjectMutationOptions(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteProject = (data: DeleteItemSchema) => {
    mutation.mutate(data);
  };

  return { deleteProject, ...mutation };
};
