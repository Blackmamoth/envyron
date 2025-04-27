import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import httpErrors from "http-errors";
import { ZodSchema } from "zod";
import { db } from "@/db";
import { env, service } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { VariableSchema } from "./validations";
import { EnvVariable, Service } from "./store";

export const getUserFromSession = async () => {
  const data = await auth.api.getSession({
    headers: await headers(),
  });
  if (!data?.user && !data?.session) {
    throw httpErrors.Unauthorized("Unauthorized");
  }
  return data.user;
};

export const validateRequestBody = async <T>(
  body: object,
  schema: ZodSchema<T, any>,
) => {
  const result = schema.safeParse(body);
  if (!result.success && !result.data) {
    const errors = result.error.errors
      .map((error) => `Error: ${error.path.join(".")} - ${error.message}`)
      .join("\n");
    throw httpErrors.UnprocessableEntity(errors);
  }
  return result.data;
};

export const addService = async (name: string, userId: string) => {
  const existingService = await db
    .select()
    .from(service)
    .where(and(eq(service.userId, userId), eq(service.name, name)));
  if (existingService.length !== 0) {
    throw httpErrors.Conflict(
      `Service [${name}] already exists in your collection`,
    );
  }

  const result = await db
    .insert(service)
    .values({ name, userId })
    .returning({ insertId: service.id });

  return result[0].insertId;
};

export const addVariables = async (
  variables: VariableSchema[],
  serviceId: string,
) => {
  const keys = variables.map((variable) => variable.key);
  const existingVariables = await db
    .select()
    .from(env)
    .where(and(eq(env.serviceId, serviceId), inArray(env.key, keys)));

  if (existingVariables.length !== 0) {
    throw httpErrors.Conflict(
      `Keys [${existingVariables.map((variable) => variable.key)}] already exist`,
    );
  }

  const insertValue = variables.map((variable) => ({
    key: variable.key,
    required: variable.required,
    serviceId: serviceId,
  }));

  const result = await db
    .insert(env)
    .values(insertValue)
    .returning({ insertId: env.id });

  return result;
};

export const getEnvVariables = async (userId: string) => {
  const rawServices = await db
    .select()
    .from(service)
    .leftJoin(env, eq(service.id, env.serviceId))
    .where(eq(service.userId, userId));

  const serviceMap = new Map<string, Service>();

  for (const row of rawServices) {
    const serviceRow = row.service;
    const envRow = row.env;

    if (!serviceMap.has(serviceRow.id)) {
      serviceMap.set(serviceRow.id, {
        id: serviceRow.id,
        name: serviceRow.name,
        userId: serviceRow.userId,
        createdAt: serviceRow.createdAt ?? null,
        updatedAt: serviceRow.updatedAt ?? null,
        variables: [],
      });
    }

    if (envRow?.id) {
      const variable: EnvVariable = {
        id: envRow.id,
        key: envRow.key,
        required: envRow.required ?? false,
        serviceId: envRow.serviceId,
        createdAt: envRow.createdAt,
        updatedAt: envRow.updatedAt,
      };

      serviceMap.get(serviceRow.id)!.variables.push(variable);
    }
  }

  return Array.from(serviceMap.values()) as Service[];
};
