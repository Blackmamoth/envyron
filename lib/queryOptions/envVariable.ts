import { EnvVariable } from "@/db/schema";
import { EnvVariableSchema } from "@/validation/service";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

const createVariables = async (
  id: string,
  body: EnvVariableSchema,
): Promise<{ message: string }> => {
  const response = await fetch(`/api/service/${id}/variable`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to create variables");
  }

  return { message: resBody?.message };
};

const getVariables = async (
  id: string,
): Promise<{ message: string; variables: EnvVariable[] }> => {
  const response = await fetch(`/api/service/${id}/variable`);

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody?.message ?? "Failed to fetch variables");
  }

  return { message: resBody?.message, variables: resBody?.variables };
};

const updateVariables = async (
  id: string,
  body: EnvVariableSchema,
): Promise<{ message: string }> => {
  const response = await fetch(`/api/service/${id}/variable`, {
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

export const createVariableMutationOptions = (id: string) =>
  mutationOptions({
    mutationKey: ["variables", id],
    mutationFn: (body: EnvVariableSchema) => createVariables(id, body),
  });

export const getVariablesQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["variables", id],
    queryFn: () => getVariables(id),
  });

export const updateVariableMutationOptions = (id: string) =>
  mutationOptions({
    mutationKey: ["variables", id, "update"],
    mutationFn: (body: EnvVariableSchema) => updateVariables(id, body),
  });
