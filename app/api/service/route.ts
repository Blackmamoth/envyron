import { db } from "@/db";
import { service } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import httpErrors from "http-errors";
import {
  getUserFromSession,
  handleAPIError,
  validateRequestBody,
} from "@/lib/action";
import { NextResponse } from "next/server";
import {
  createItemSchema,
  CreateItemSchema,
  updateServiceSchema,
  UpdateServiceSchema,
} from "@/validation/service";

export async function GET() {
  try {
    const sessionUser = await getUserFromSession();

    const userId = sessionUser.id;

    const services = await db
      .select()
      .from(service)
      .where(eq(service.user, userId))
      .orderBy(asc(service.createdAt));

    return NextResponse.json({
      message: "Successfully fetched all services",
      services,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(req: Request) {
  try {
    const sessionUser = await getUserFromSession();

    const { name, description } = await validateRequestBody<CreateItemSchema>(
      await req.json(),
      createItemSchema,
    );

    const userId = sessionUser.id;

    const doesServiceExist = await db
      .select()
      .from(service)
      .where(and(eq(service.name, name), eq(service.user, userId)));

    if (doesServiceExist.length !== 0) {
      throw new httpErrors.Conflict(
        `'service' with name '${name}' already exists`,
      );
    }

    const serviceObject = await db
      .insert(service)
      .values({ name, description, user: userId })
      .returning({ serviceId: service.id });

    if (!serviceObject[0].serviceId) {
      throw new httpErrors.InternalServerError("service could not be created");
    }

    return NextResponse.json(
      {
        message: "service was successfully created!",
        service: {
          id: serviceObject[0].serviceId,
          name: name,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const sessionUser = await getUserFromSession();

    const { service_id, name, description } =
      await validateRequestBody<UpdateServiceSchema>(
        await req.json(),
        updateServiceSchema,
      );

    const userId = sessionUser.id;

    const isUsersService = await db
      .select()
      .from(service)
      .where(and(eq(service.id, service_id), eq(service.user, userId)));

    if (isUsersService.length === 0) {
      throw new httpErrors.Forbidden(
        `This service does not belong to the user`,
      );
    }

    const isServiceNameTaken = await db
      .select()
      .from(service)
      .where(and(eq(service.name, name), eq(service.user, userId)));

    if (isServiceNameTaken.length !== 0) {
      throw new httpErrors.Conflict(
        `Service with name [${name}] already exists`,
      );
    }

    const result = await db
      .update(service)
      .set({ name: name, description: description })
      .where(and(eq(service.id, service_id), eq(service.user, userId)));

    if (result.rowCount !== 0) {
      return NextResponse.json(
        { message: "service updated successfully!" },
        { status: 200 },
      );
    } else {
      throw new httpErrors.InternalServerError(
        "your service could not be updated, please try again!",
      );
    }
  } catch (error) {
    return handleAPIError(error);
  }
}
