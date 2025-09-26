import { db } from "@/db";
import {
  project,
  projectComposition,
  template,
  templateComposition,
} from "@/db/schema";
import {
  getUserFromSession,
  handleAPIError,
  validateRequestBody,
} from "@/lib/action";
import {
  createProjectSchema,
  type CreateProjectSchema,
  updateItemSchema,
  type UpdateItemSchema,
  deleteItemSchema,
  type DeleteItemSchema,
} from "@/lib/validation";
import type { Item } from "@/types";
import { and, asc, eq } from "drizzle-orm";
import httpErrors from "http-errors";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sessionUser = await getUserFromSession();

    const userId = sessionUser.id;

    const projects = await db
      .select()
      .from(project)
      .where(eq(project.user, userId))
      .orderBy(asc(project.createdAt));

    return NextResponse.json({
      message: "Successfully fetched all services",
      projects,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(req: Request) {
  try {
    const sessionUser = await getUserFromSession();

    const {
      name,
      description,
      template: templateId,
    } = await validateRequestBody<CreateProjectSchema>(
      await req.json(),
      createProjectSchema,
    );

    const userId = sessionUser.id;

    const doesProjectExist = await db
      .select()
      .from(project)
      .where(and(eq(project.name, name), eq(project.user, userId)));

    if (doesProjectExist.length !== 0) {
      throw httpErrors.Conflict(`project with name [${name}] already exists`);
    }

    if (templateId) {
      const doesTemplateExist = await db
        .select()
        .from(template)
        .where(and(eq(template.id, templateId), eq(template.user, userId)));
      if (doesTemplateExist.length === 0) {
        throw httpErrors.NotFound(
          `template with id [${templateId}] does not exist`,
        );
      }
    }

    let projectId: string = "";

    await db.transaction(async (tx) => {
      const result = await tx
        .insert(project)
        .values({ name, description, user: userId, template: templateId })
        .returning({ projectId: project.id });

      if (!result[0].projectId) {
        throw httpErrors.InternalServerError("project could not be created");
      }

      projectId = result[0].projectId;

      if (templateId) {
        // const compositions = await db
        //   .select({ service: templateComposition.service })
        //   .from(templateComposition)
        //   .innerJoin(template, eq(template.id, templateComposition.template))
        //   .where(and(eq(template.user, userId), eq(template.id, templateId)))
        //   .orderBy(asc(templateComposition.template));

        const templateExists = await db
          .select({ id: template.id })
          .from(template)
          .where(and(eq(template.id, templateId), eq(template.user, userId)));

        if (templateExists.length === 0)
          throw httpErrors.NotFound(
            `template with id [${templateId}] does not exist`,
          );

        const compositions = await db
          .select({ service: templateComposition.service })
          .from(templateComposition)
          .where(eq(templateComposition.template, templateId));

        if (compositions.length) {
          const projectCompositions = compositions.map((p) => ({
            service: p.service,
            project: projectId,
          }));

          await tx.insert(projectComposition).values(projectCompositions);
        }
      }
    });

    return NextResponse.json(
      {
        project: {
          id: projectId,
          name,
        },
        message: "project successfully created",
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

    const isUsersProject = await db
      .select()
      .from(project)
      .where(and(eq(project.id, item_id), eq(project.user, userId)));

    if (isUsersProject.length === 0) {
      throw new httpErrors.NotFound(
        `project with id [${item_id}] does not exist`,
      );
    }

    const isProjectNameTaken = await db
      .select()
      .from(project)
      .where(and(eq(project.name, name), eq(project.user, userId)));

    if (isProjectNameTaken.length !== 0) {
      throw new httpErrors.Conflict(
        `project with name [${name}] already exists`,
      );
    }

    const updateValues: Item = { name };

    if (description) {
      updateValues.description = description;
    }

    const result = await db
      .update(project)
      .set(updateValues)
      .where(and(eq(project.id, item_id), eq(project.user, userId)));

    if (result.rowCount !== 0) {
      return NextResponse.json(
        { message: "project updated successfully!" },
        { status: 200 },
      );
    } else {
      throw new httpErrors.InternalServerError(
        "your project could not be updated, please try again!",
      );
    }
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const sessionUser = await getUserFromSession();

    const { id: projectId } = await validateRequestBody<DeleteItemSchema>(
      await req.json(),
      deleteItemSchema,
    );

    const userId = sessionUser.id;

    const doesTemplateExist = await db
      .select()
      .from(project)
      .where(and(eq(project.id, projectId), eq(project.user, userId)));

    if (doesTemplateExist.length === 0) {
      throw httpErrors.NotFound(
        `template with id [${projectId}] does not exist`,
      );
    }

    const result = await db
      .delete(project)
      .where(and(eq(project.id, projectId), eq(template.user, userId)));

    console.log();
    console.log(result);

    if (result.rowCount === 0) {
      throw new httpErrors.InternalServerError("project was not deleted!");
    }

    return NextResponse.json({ message: "project was successfully deleted!" });
  } catch (error) {
    return handleAPIError(error);
  }
}
