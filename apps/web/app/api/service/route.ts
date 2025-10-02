import { and, asc, eq } from "drizzle-orm";
import httpErrors from "http-errors";
import { NextResponse } from "next/server";
import { db } from "@envyron/db";
import { service } from "@envyron/db/schema";
import {
  getUserFromSession,
  handleAPIError,
  validateRequestBody,
} from "@/lib/action";
import {
  createItemSchema,
  updateItemSchema,
  deleteItemSchema,
} from "@/lib/validation";
import type {
  CreateItemSchema,
  DeleteItemSchema,
  Item,
  UpdateItemSchema,
} from "@/types";

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

    const result = await db
      .insert(service)
      .values({ name, description, user: userId })
      .returning({ serviceId: service.id });

    if (!result[0].serviceId) {
      throw new httpErrors.InternalServerError("service could not be created");
    }

    return NextResponse.json(
      {
        message: "service was successfully created!",
        service: {
          id: result[0].serviceId,
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

    const { item_id, name, description } =
      await validateRequestBody<UpdateItemSchema>(
        await req.json(),
        updateItemSchema,
      );

    const userId = sessionUser.id;

    const isUsersService = await db
      .select()
      .from(service)
      .where(and(eq(service.id, item_id), eq(service.user, userId)));

    if (isUsersService.length === 0) {
      throw new httpErrors.NotFound(
        `service with id [${item_id}] does not exist`,
      );
    }

    const isServiceNameTaken = await db
      .select()
      .from(service)
      .where(and(eq(service.name, name), eq(service.user, userId)));

    if (isServiceNameTaken.length !== 0) {
      throw new httpErrors.Conflict(
        `service with name [${name}] already exists`,
      );
    }

    const updateValues: Item = { name };

    if (description) {
      updateValues.description = description;
    }

    const result = await db
      .update(service)
      .set(updateValues)
      .where(and(eq(service.id, item_id), eq(service.user, userId)));

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

export async function DELETE(req: Request) {
  try {
    const sessionUser = await getUserFromSession();

    const { id: serviceId } = await validateRequestBody<DeleteItemSchema>(
      await req.json(),
      deleteItemSchema,
    );

    const userId = sessionUser.id;

    const doesserviceExist = await db
      .select()
      .from(service)
      .where(and(eq(service.id, serviceId), eq(service.user, userId)));

    if (doesserviceExist.length === 0) {
      throw httpErrors.NotFound(
        `service with id [${serviceId}] does not exist`,
      );
    }

    const result = await db
      .delete(service)
      .where(and(eq(service.id, serviceId), eq(service.user, userId)));

    if (result.rowCount === 0) {
      throw new httpErrors.InternalServerError("service was not deleted!");
    }

    return NextResponse.json({ message: "service was successfully deleted!" });
  } catch (error) {
    return handleAPIError(error);
  }
}
