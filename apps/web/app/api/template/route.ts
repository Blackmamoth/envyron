import { and, asc, eq } from "drizzle-orm";
import httpErrors from "http-errors";
import { NextResponse } from "next/server";
import { db } from "@envyron/db";
import { template } from "@envyron/db/schema";
import {
  getUserFromSession,
  handleAPIError,
  validateRequestBody,
} from "@/lib/action";
import {
  createItemSchema,
  updateItemSchema,
  deleteItemSchema,
} from "@envyron/lib/validation";
import type {
  CreateItemSchema,
  DeleteItemSchema,
  Item,
  UpdateItemSchema,
} from "@envyron/types";

export async function GET() {
  try {
    const sessionUser = await getUserFromSession();

    const userId = sessionUser.id;

    const templates = await db
      .select()
      .from(template)
      .where(eq(template.user, userId))
      .orderBy(asc(template.createdAt));

    return NextResponse.json({
      message: "Successfully fetched all templates",
      templates,
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

    const doesTemplateExist = await db
      .select()
      .from(template)
      .where(and(eq(template.name, name), eq(template.user, userId)));

    if (doesTemplateExist.length !== 0) {
      throw new httpErrors.Conflict(
        `template with name [${name}] already exists`,
      );
    }

    const result = await db
      .insert(template)
      .values({ name, description, user: userId })
      .returning({ templateId: template.id });

    if (!result[0].templateId) {
      throw new httpErrors.InternalServerError("tempalte could not be created");
    }

    return NextResponse.json(
      {
        message: "template was successfully created!",
        template: {
          id: result[0].templateId,
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

    const isValidTemplate = await db
      .select()
      .from(template)
      .where(and(eq(template.id, item_id), eq(template.user, userId)));

    if (isValidTemplate.length === 0) {
      throw new httpErrors.NotFound(
        `template with id [${item_id}] does not exist`,
      );
    }

    const isTemplateNameTaken = await db
      .select()
      .from(template)
      .where(and(eq(template.name, name), eq(template.user, userId)));

    if (isTemplateNameTaken.length !== 0) {
      throw new httpErrors.Conflict(
        `template with name [${name}] already exists`,
      );
    }

    const updateValues: Item = { name };

    if (description) {
      updateValues.description = description;
    }

    const result = await db
      .update(template)
      .set(updateValues)
      .where(and(eq(template.id, item_id), eq(template.user, userId)));

    if (result.rowCount !== 0) {
      return NextResponse.json(
        { message: "template updated successfully!" },
        { status: 200 },
      );
    } else {
      throw new httpErrors.InternalServerError(
        "your template could not be updated, please try again!",
      );
    }
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const sessionUser = await getUserFromSession();

    const { id: templateId } = await validateRequestBody<DeleteItemSchema>(
      await req.json(),
      deleteItemSchema,
    );

    const userId = sessionUser.id;

    const doesTemplateExist = await db
      .select()
      .from(template)
      .where(and(eq(template.id, templateId), eq(template.user, userId)));

    if (doesTemplateExist.length === 0) {
      throw httpErrors.NotFound(
        `template with id [${templateId}] does not exist`,
      );
    }

    const result = await db
      .delete(template)
      .where(and(eq(template.id, templateId), eq(template.user, userId)));

    if (result.rowCount === 0) {
      throw new httpErrors.InternalServerError("template was not deleted!");
    }

    return NextResponse.json({ message: "template was successfully deleted!" });
  } catch (error) {
    return handleAPIError(error);
  }
}
