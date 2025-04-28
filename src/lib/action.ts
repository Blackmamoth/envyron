import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import httpErrors from "http-errors";
import { ZodSchema } from "zod";
import { db } from "@/db";
import { env, service } from "@/db/schema";
import { and, eq, inArray, ne, notInArray } from "drizzle-orm";
import {
  AddNewVariablesSchema,
  EditServiceSchema,
  VariableSchema,
} from "./validations";
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
  schema: ZodSchema<T>,
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

  return result.map((r) => r.insertId);
};

export const getEnvVariables = async (userId: string) => {
  const rawServices = await db
    .select()
    .from(service)
    .leftJoin(env, eq(service.id, env.serviceId))
    .where(eq(service.userId, userId))
    .orderBy(env.createdAt);

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

const getServiceById = async (serviceId: string, userId: string) => {
  const existingService = await db
    .select()
    .from(service)
    .where(and(eq(service.id, serviceId), eq(service.userId, userId)));

  if (existingService.length === 0) {
    return null;
  }

  return existingService[0];
};

export const addNewVariables = async (
  userId: string,
  { service_id, variables }: AddNewVariablesSchema,
) => {
  const existingService = await getServiceById(service_id, userId);

  if (!existingService) {
    throw httpErrors.Conflict(`Service [${service_id}] not found`);
  }

  return await addVariables(variables, service_id);
};

export const editService = async (
  userId: string,
  { name, variables, service_id }: EditServiceSchema,
) => {
  const existingService = await getServiceById(service_id, userId);

  if (!existingService) {
    throw httpErrors.Conflict(`Service [${service_id}] not found`);
  }

  const existingServiceWithSameName = await db
    .select()
    .from(service)
    .where(
      and(
        eq(service.name, name),
        eq(service.userId, userId),
        ne(service.id, service_id),
      ),
    );

  await db.transaction(async (tx) => {
    if (existingServiceWithSameName.length === 0) {
      await tx
        .update(service)
        .set({ name })
        .where(
          and(eq(service.id, existingService.id), eq(service.userId, userId)),
        );
    }

    const varIds = variables.map((variable) => variable.id!);

    await tx
      .delete(env)
      .where(
        and(eq(env.serviceId, existingService.id), notInArray(env.id, varIds)),
      );

    await Promise.all(
      variables.map(async (variableObj) => {
        const variable = await tx
          .select()
          .from(env)
          .where(
            and(
              eq(env.id, variableObj.id!),
              eq(env.serviceId, variableObj.serviceId!),
            ),
          );

        if (variable.length === 0) {
          throw new httpErrors.Conflict(
            `Variable [${variableObj.id}] does not exist`,
          );
        }

        const envVar = variable[0];

        const hasNewChange =
          envVar.key !== variableObj.key ||
          envVar.required !== variableObj.required;

        if (hasNewChange) {
          const checkKey = await tx
            .select()
            .from(env)
            .where(
              and(
                eq(env.key, variableObj.key),
                eq(env.serviceId, variableObj.serviceId!),
                ne(env.id, variableObj.id!),
              ),
            );

          if (checkKey.length !== 0) {
            throw httpErrors.Conflict(
              `There already exist a variable with key [${variableObj.key}] in service [${existingService.name}]`,
            );
          }

          await tx
            .update(env)
            .set({ key: variableObj.key, required: variableObj.required })
            .where(
              and(
                eq(env.serviceId, variableObj.serviceId!),
                eq(env.id, variableObj.id!),
              ),
            );
        }
      }),
    );
  });
};

export const deleteService = async (serviceId: string, userId: string) => {
  const existingService = await getServiceById(serviceId, userId);
  if (!existingService) {
    throw httpErrors.Conflict(`Service [${serviceId}] does not exist`);
  }

  await db.delete(env).where(eq(env.serviceId, existingService.id));
  await db
    .delete(service)
    .where(
      and(
        eq(service.id, existingService.id),
        eq(service.userId, existingService.userId),
      ),
    );
};
