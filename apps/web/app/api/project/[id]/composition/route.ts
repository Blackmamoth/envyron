import { and, asc, eq, inArray, notInArray } from "drizzle-orm";
import httpErrors from "http-errors";
import { NextResponse } from "next/server";
import { db } from "@envyron/db";
import { service, project, projectComposition } from "@envyron/db/schema";
import {
  getUserFromSession,
  handleAPIError,
  validateRequestBody,
} from "@/lib/action";
import { syncProjectSchema } from "@/lib/validation";
import type { SyncProjectSchema } from "@/types";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    const userId = sessionUser.id;

    const { id: projectId } = await params;

    const compositions = await db
      .select({ service: projectComposition.service })
      .from(projectComposition)
      .innerJoin(project, eq(project.id, projectComposition.project))
      .where(and(eq(project.user, userId), eq(project.id, projectId)))
      .orderBy(asc(projectComposition.project));

    return NextResponse.json(
      { compositions, message: "fetched all compositions" },
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

    const { id: projectId } = await params;

    const { services } = await validateRequestBody<SyncProjectSchema>(
      await req.json(),
      syncProjectSchema,
    );

    const doServicesExist = await db
      .select()
      .from(service)
      .where(and(inArray(service.id, services), eq(service.user, userId)));

    if (doServicesExist.length !== services.length) {
      throw httpErrors.BadRequest(
        "one or more services from your selection do not exist",
      );
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(projectComposition)
        .where(
          and(
            eq(projectComposition.project, projectId),
            notInArray(projectComposition.service, services),
          ),
        );

      if (services.length) {
        const compositions = services.map((service) => ({
          service,
          project: projectId,
        }));

        await tx
          .insert(projectComposition)
          .values(compositions)
          .onConflictDoNothing();
      }
    });

    return NextResponse.json(
      { message: "project successfully saved" },
      { status: 200 },
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
