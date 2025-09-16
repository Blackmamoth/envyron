import { db } from "@/db";
import { service } from "@/db/schema";
import { getUserFromSession, handleAPIError } from "@/lib/action";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import httpError from "http-errors";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    const userId = sessionUser.id;

    const { id: serviceId } = await params;

    const serviceRecord = await db
      .select()
      .from(service)
      .where(and(eq(service.id, serviceId), eq(service.user, userId)))
      .limit(1);

    if (serviceRecord.length === 0) {
      throw new httpError.NotFound(
        `service with id [${serviceId}] does not exist`,
      );
    }

    return NextResponse.json({
      service: serviceRecord[0],
      message: "service fetched",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
