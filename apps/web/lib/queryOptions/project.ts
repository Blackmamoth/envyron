import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type {
  Project,
  CreateProjectSchema,
  DeleteItemSchema,
  SyncProjectSchema,
  UpdateItemSchema,
} from "@envyron/types";

const createProject = async (
  body: CreateProjectSchema,
): Promise<{ message: string; project: { id: string; name: string } }> => {
  const response = await fetch("/api/project", {
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

  return { message: resBody?.message, project: resBody?.project };
};

const deleteProject = async ({
  id,
}: DeleteItemSchema): Promise<{ message: string }> => {
  const response = await fetch("/api/project", {
    method: "DELETE",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to delete project");
  }

  return { message: resBody?.message };
};

const getProjects = async (): Promise<{
  message: string;
  projects: Project[];
}> => {
  const response = await fetch("/api/project");

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to fetch services");
  }
  return { message: resBody?.message, projects: resBody.projects };
};

const getProject = async (
  id: string,
): Promise<{ project: Project; message: string }> => {
  const response = await fetch(`/api/project/${id}`);

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to fetch project");
  }

  return { project: resBody?.project, message: resBody?.message };
};

const getProjectCompositions = async (
  id: string,
): Promise<{ compositions: { service: string }[]; message: string }> => {
  const response = await fetch(`/api/project/${id}/composition`);

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to fetch project compositions");
  }

  return { compositions: resBody?.compositions, message: resBody?.message };
};

const updateProject = async (
  updateProjectData: UpdateItemSchema,
): Promise<{ message: string }> => {
  const response = await fetch("/api/project", {
    method: "PATCH",
    body: JSON.stringify(updateProjectData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to update project");
  }

  return { message: resBody?.message };
};

const syncProjectServices = async (
  id: string,
  body: SyncProjectSchema,
): Promise<{ message: string }> => {
  const response = await fetch(`/api/project/${id}/composition`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to save variables");
  }

  return { message: resBody?.message };
};

export const createProjectMutationOptions = () =>
  mutationOptions({
    mutationKey: ["projects", "create"],
    mutationFn: createProject,
  });

export const getProjectsQueryOptions = () =>
  queryOptions({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

export const getProjectQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
  });

export const updateProjectMutationOptions = () =>
  mutationOptions({
    mutationKey: ["projects", "update"],
    mutationFn: updateProject,
  });

export const syncProjectMutationOptions = (id: string) =>
  mutationOptions({
    mutationKey: ["projects", id, "sync"],
    mutationFn: (body: SyncProjectSchema) => syncProjectServices(id, body),
  });

export const getProjectCompositionQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["project", id, "compositions"],
    queryFn: () => getProjectCompositions(id),
  });

export const deleteProjectMutationOptions = () =>
  mutationOptions({
    mutationKey: ["project", "delete"],
    mutationFn: deleteProject,
  });
