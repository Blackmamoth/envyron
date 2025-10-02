import { and, eq } from "drizzle-orm";
import httpError from "http-errors";
import { NextResponse } from "next/server";
import { db } from "@envyron/db";
import { template } from "@envyron/db/schema";
import { getUserFromSession, handleAPIError } from "@/lib/action";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    const userId = sessionUser.id;

    const { id: templateId } = await params;

    const result = await db
      .select()
      .from(template)
      .where(and(eq(template.id, templateId), eq(template.user, userId)))
      .limit(1);

    if (result.length === 0) {
      throw new httpError.NotFound(
        `template with id [${templateId}] does not exist`,
      );
    }

    return NextResponse.json({
      template: result[0],
      message: "template fetched",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
