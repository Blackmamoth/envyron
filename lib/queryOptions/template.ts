import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { Template, TemplateComposition } from "@/db/schema";
import type {
  CreateItemSchema,
  SyncTemplateSchema,
  UpdateItemSchema,
} from "@/lib/validation";

const createTemplate = async (
  body: CreateItemSchema,
): Promise<{ message: string; template: { id: string; name: string } }> => {
  const response = await fetch("/api/template", {
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

  return { message: resBody?.message, template: resBody?.template };
};

const getTemplates = async (): Promise<{
  message: string;
  templates: Template[];
}> => {
  const response = await fetch("/api/template");

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to fetch services");
  }
  return { message: resBody?.message, templates: resBody.templates };
};

const getTemplate = async (
  id: string,
): Promise<{ template: Template; message: string }> => {
  const response = await fetch(`/api/template/${id}`);

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to fetch template");
  }

  return { template: resBody?.template, message: resBody?.message };
};

const getTemplateCompositions = async (
  id: string,
): Promise<{ compositions: TemplateComposition[]; message: string }> => {
  const response = await fetch(`/api/template/${id}/composition`);

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(
      resBody?.message ?? "Failed to fetch template compositions",
    );
  }

  return { compositions: resBody?.compositions, message: resBody?.message };
};

const updateTemplate = async (
  updateTemplateData: UpdateItemSchema,
): Promise<{ message: string }> => {
  const response = await fetch("/api/template", {
    method: "PATCH",
    body: JSON.stringify(updateTemplateData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to update template");
  }

  return { message: resBody?.message };
};

const syncTemplateServices = async (
  id: string,
  body: SyncTemplateSchema,
): Promise<{ message: string }> => {
  console.log(body);
  const response = await fetch(`/api/template/${id}/composition`, {
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

export const createTemplateMutationOptions = () =>
  mutationOptions({
    mutationKey: ["templates", "create"],
    mutationFn: createTemplate,
  });

export const getTemplatesQueryOptions = () =>
  queryOptions({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

export const getTemplateQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["template", id],
    queryFn: () => getTemplate(id),
  });

export const updateTemplateMutationOptions = () =>
  mutationOptions({
    mutationKey: ["templates", "update"],
    mutationFn: updateTemplate,
  });

export const syncTemplateMutationOptions = (id: string) =>
  mutationOptions({
    mutationKey: ["templates", id, "sync"],
    mutationFn: (body: SyncTemplateSchema) => syncTemplateServices(id, body),
  });

export const getCompositionQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["template", id, "compositions"],
    queryFn: () => getTemplateCompositions(id),
  });
