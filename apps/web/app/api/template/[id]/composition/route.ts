import { and, asc, eq, inArray, notInArray } from "drizzle-orm";
import httpErrors from "http-errors";
import { NextResponse } from "next/server";
import { db } from "@envyron/db";
import { service, template, templateComposition } from "@envyron/db/schema";
import {
  getUserFromSession,
  handleAPIError,
  validateRequestBody,
} from "@/lib/action";
import { syncTemplateSchema } from "@/lib/validation";
import type { SyncTemplateSchema } from "@/types";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    const userId = sessionUser.id;

    const { id: templateId } = await params;

    const compositions = await db
      .select({ service: templateComposition.service })
      .from(templateComposition)
      .innerJoin(template, eq(template.id, templateComposition.template))
      .where(and(eq(template.user, userId), eq(template.id, templateId)))
      .orderBy(asc(templateComposition.template));

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

    const { id: templateId } = await params;

    const { services } = await validateRequestBody<SyncTemplateSchema>(
      await req.json(),
      syncTemplateSchema,
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
        .delete(templateComposition)
        .where(
          and(
            eq(templateComposition.template, templateId),
            notInArray(templateComposition.service, services),
          ),
        );

      const compositions = services.map((service) => ({
        service,
        template: templateId,
      }));

      await tx
        .insert(templateComposition)
        .values(compositions)
        .onConflictDoNothing();
    });

    return NextResponse.json(
      { message: "template successfully saved" },
      { status: 200 },
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
