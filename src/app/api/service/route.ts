import {
  addService,
  addVariables,
  deleteService,
  editService,
  getEnvVariables,
  getUserFromSession,
  validateRequestBody,
} from "@/lib/action";
import {
  EditServiceSchema,
  editServiceSchema,
  ServiceSchema,
  serviceSchema,
} from "@/lib/validations";
import { NextResponse } from "next/server";
import httpErrors from "http-errors";
import { ZodSchema } from "zod";

export async function GET() {
  try {
    const user = await getUserFromSession();

    const services = await getEnvVariables(user.id);

    return NextResponse.json({ services }, { status: 200 });
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

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();

    const body = await req.json();

    if (!body) {
      throw httpErrors.UnprocessableEntity("request body is required");
    }

    const data = await validateRequestBody<ServiceSchema>(
      body,
      serviceSchema as ZodSchema,
    );

    const serviceId = await addService(data!.name, user.id);

    const variableIds = await addVariables(data!.variables, serviceId);

    if (variableIds.length !== 0) {
      return NextResponse.json(
        { message: "Your service and variables were successfully saved" },
        { status: 200 },
      );
    }
    throw httpErrors.InternalServerError(
      "No variables were inserted, please try again later",
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
          "An error occured while creating your service, please try again later.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUserFromSession();

    const body = await req.json();
    if (!body) {
      throw httpErrors.UnprocessableEntity("request body is required");
    }

    const data = await validateRequestBody<EditServiceSchema>(
      body,
      editServiceSchema,
    );

    await editService(user.id, {
      name: data!.name,
      service_id: data!.service_id,
      variables: data!.variables,
    });

    return NextResponse.json(
      { message: "Your service was successfully updated" },
      { status: 200 },
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
          "An error occured while creating your service, please try again later.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getUserFromSession();

    const body = await req.json();

    if (!body.service_id) {
      throw httpErrors.UnprocessableEntity("service_id is required");
    }

    await deleteService(body.service_id, user.id);
    return NextResponse.json(
      { message: "Service successfully deleted" },
      { status: 200 },
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
          "An error occured while creating your service, please try again later.",
      },
      { status: 500 },
    );
  }
}
