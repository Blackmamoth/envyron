import { db } from "@/db";
import { envVariable, service } from "@/db/schema";
import {
  getUserFromSession,
  handleAPIError,
  validateRequestBody,
} from "@/lib/action";
import { envVariableSchema, EnvVariableSchema } from "@/validation/service";
import { and, asc, eq, inArray, notInArray } from "drizzle-orm";
import httpError from "http-errors";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    const userId = sessionUser.id;

    const { id: serviceId } = await params;

    const doesServiceExist = await db
      .select()
      .from(service)
      .where(and(eq(service.id, serviceId), eq(service.user, userId)));

    if (doesServiceExist.length === 0) {
      throw httpError.NotFound(`service with id [${serviceId}] does not exist`);
    }

    const variables = await db
      .select()
      .from(envVariable)
      .where(eq(envVariable.service, serviceId))
      .orderBy(asc(envVariable.createdAt));

    return NextResponse.json(
      { variables, message: "variables fetched successfully" },
      { status: 200 },
    );
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    const userId = sessionUser.id;

    const { id: serviceId } = await params;

    const { env_variables } = await validateRequestBody<EnvVariableSchema>(
      await req.json(),
      envVariableSchema,
    );

    const doesServiceExist = await db
      .select()
      .from(service)
      .where(and(eq(service.id, serviceId), eq(service.user, userId)));

    if (doesServiceExist.length === 0) {
      throw httpError.NotFound(`service with id [${serviceId}] does not exist`);
    }

    const keys = env_variables.map((v) => v.key);

    const isVariableNameTaken = await db
      .select()
      .from(envVariable)
      .where(
        and(eq(envVariable.service, serviceId), inArray(envVariable.key, keys)),
      );

    if (isVariableNameTaken.length !== 0) {
      throw httpError.Conflict("conflicting keys in the current service");
    }

    const variables = env_variables.map((v) => ({ ...v, service: serviceId }));

    await db.transaction(async (tx) => {
      await tx.insert(envVariable).values(variables);
    });

    return NextResponse.json(
      { message: "variables successfully created" },
      { status: 200 },
    );
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    const userId = sessionUser.id;

    const { id: serviceId } = await params;

    const { env_variables } = await validateRequestBody<EnvVariableSchema>(
      await req.json(),
      envVariableSchema,
    );

    const doesServiceExist = await db
      .select()
      .from(service)
      .where(and(eq(service.id, serviceId), eq(service.user, userId)));

    if (doesServiceExist.length === 0) {
      throw httpError.NotFound(`service with id [${serviceId}] does not exist`);
    }

    await db.transaction(async (tx) => {
      const existing = await tx
        .select()
        .from(envVariable)
        .where(eq(envVariable.service, serviceId));

      const incomingKeys = env_variables.map((v) => v.key);
      const existingKeys = existing.map((v) => v.key);

      await tx
        .delete(envVariable)
        .where(
          and(
            eq(envVariable.service, serviceId),
            notInArray(envVariable.key, incomingKeys),
          ),
        );

      const toInsert = env_variables.filter(
        (v) => !existingKeys.includes(v.key),
      );
      const toUpdate = env_variables.filter((v) =>
        existingKeys.includes(v.key),
      );

      if (toInsert.length) {
        await tx.insert(envVariable).values(
          toInsert.map((v) => ({
            key: v.key,
            defaultValue: v.defaultValue,
            required: v.required,
            type: v.type,
            service: serviceId,
          })),
        );
      }

      for (const v of toUpdate) {
        await tx
          .update(envVariable)
          .set({
            defaultValue: v.defaultValue,
            required: v.required,
            type: v.type,
          })
          .where(
            and(eq(envVariable.service, serviceId), eq(envVariable.key, v.key)),
          );
      }
    });

    return NextResponse.json(
      { message: "service variables successfully saved!" },
      { status: 200 },
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
