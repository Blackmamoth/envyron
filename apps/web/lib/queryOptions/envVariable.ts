import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { EnvVariable, EnvVariableSchema } from "@envyron/types";

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

const syncVariables = async (
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

export const getVariablesQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["variables", id],
    queryFn: () => getVariables(id),
  });

export const syncVariableMutationOptions = (id: string) =>
  mutationOptions({
    mutationKey: ["variables", id, "sync"],
    mutationFn: (body: EnvVariableSchema) => syncVariables(id, body),
  });
