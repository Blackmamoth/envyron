import { NextResponse } from "next/server";
import httpErrors from "http-errors";
import {
  addNewVariables,
  getUserFromSession,
  validateRequestBody,
} from "@/lib/action";
import {
  addNewVariablesSchema,
  AddNewVariablesSchema,
} from "@/lib/validations";

export async function PUT(req: Request) {
  try {
    const user = await getUserFromSession();

    const body = await req.json();
    if (!body) {
      throw httpErrors.UnprocessableEntity("request body is required");
    }

    const data = await validateRequestBody<AddNewVariablesSchema>(
      body,
      addNewVariablesSchema,
    );

    const insertIds = await addNewVariables(user.id, data!);
    if (insertIds.length > 0) {
      return NextResponse.json(
        { message: "Your service and variables were successfully saved" },
        { status: 200 },
      );
    }
    throw httpErrors.InternalServerError(
      "No variables were added, please try again later",
    );
  } catch (error) {
    if (error instanceof httpErrors.HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      {
        message:
          "An error occured while fetching your services, please try again later.",
      },
      { status: 500 },
    );
  }
}
