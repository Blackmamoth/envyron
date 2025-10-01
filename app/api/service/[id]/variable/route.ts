import { and, asc, eq, notInArray, sql } from "drizzle-orm";
import httpError from "http-errors";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { envVariable, service } from "@/db/schema";
import {
  getUserFromSession,
  handleAPIError,
  validateRequestBody,
} from "@/lib/action";
import { envVariableSchema } from "@/lib/validation";
import type { EnvVariableSchema } from "@/types";

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
      const keys = env_variables.map((v) => v.key);

      await tx
        .delete(envVariable)
        .where(
          and(
            eq(envVariable.service, serviceId),
            notInArray(envVariable.key, keys),
          ),
        );

      const variables = env_variables.map((v) => ({
        ...v,
        service: serviceId,
      }));

      await tx
        .insert(envVariable)
        .values(variables)
        .onConflictDoUpdate({
          target: [envVariable.service, envVariable.key],
          set: {
            defaultValue: sql.raw(`excluded.${envVariable.defaultValue.name}`),
            type: sql.raw(`excluded.${envVariable.type.name}`),
            required: sql.raw(`excluded.${envVariable.required.name}`),
          },
        });
    });

    return NextResponse.json(
      { message: "service variables successfully saved!" },
      { status: 200 },
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
