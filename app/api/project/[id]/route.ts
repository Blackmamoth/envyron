import { and, eq } from "drizzle-orm";
import httpError from "http-errors";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { project } from "@/db/schema";
import { getUserFromSession, handleAPIError } from "@/lib/action";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    const userId = sessionUser.id;

    const { id: projectId } = await params;

    const result = await db
      .select()
      .from(project)
      .where(and(eq(project.id, projectId), eq(project.user, userId)))
      .limit(1);

    if (result.length === 0) {
      throw new httpError.NotFound(
        `project with id [${projectId}] does not exist`,
      );
    }

    return NextResponse.json({
      project: result[0],
      message: "project fetched",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
