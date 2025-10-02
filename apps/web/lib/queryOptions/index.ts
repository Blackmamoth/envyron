import type { EnvVariable } from "@envyron/types";
import type { QueryClient } from "@tanstack/react-query";
import type { SetStateAction } from "react";
import { getVariablesQueryOptions } from "./envVariable";

export async function getServiceVariables(
  queryClient: QueryClient,
  serviceId: string,
  setServiceVariables: React.Dispatch<
    SetStateAction<Record<string, EnvVariable[]>>
  >,
) {
  try {
    const result = await queryClient.fetchQuery(
      getVariablesQueryOptions(serviceId),
    );
    setServiceVariables((prev) => ({
      ...prev,
      [serviceId]: result.variables,
    }));
  } catch (error) {
    console.error(error);
  }
}
