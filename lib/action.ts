import httpErrors from "http-errors";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { auth } from "./auth";
import { DrizzleError } from "drizzle-orm";

export const getUserFromSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new httpErrors.Unauthorized("unauthorized");

  return session.user;
};

export const validateRequestBody = async <T>(
  body: unknown,
  schema: ZodType<T>,
): Promise<T> => {
  const data = await schema.safeParseAsync(body);
  if (!data.success)
    throw new httpErrors.UnprocessableEntity(data.error.message);
  return data.data;
};

export const handleAPIError = (error: unknown) => {
  if (error instanceof ZodError) {
    return NextResponse.json({ message: error.message }, { status: 422 });
  } else if (error instanceof httpErrors.HttpError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode },
    );
  } else if (error instanceof DrizzleError) {
    console.error(error.message);
    return NextResponse.json(
      { message: "something went wrong, please try again" },
      { status: 500 },
    );
  } else {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
};
