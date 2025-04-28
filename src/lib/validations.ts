import { z } from "zod";

export const variableSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().min(1, "please provide a valid name for the key"),
  required: z.boolean().default(false).optional(),
  serviceId: z.string().uuid().optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(1, "please provide a valid name for the service"),
  variables: z
    .array(variableSchema)
    .min(1, "At least one variable should be added for this service"),
});

export const addNewVariablesSchema = z.object({
  service_id: z.string().uuid({ message: "service_id should be UUID" }),
  variables: z
    .array(variableSchema)
    .min(1, "At least one new variable should be added for this service"),
});

export const editServiceSchema = z.object({
  service_id: z.string().uuid({ message: "service_id should be UUID" }),
  name: z.string().min(1, "please provide a valid name for the service"),
  variables: z
    .array(variableSchema)
    .min(1, "At least one variable should be added for this service"),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;

export type VariableSchema = z.infer<typeof variableSchema>;

export type AddNewVariablesSchema = z.infer<typeof addNewVariablesSchema>;

export type EditServiceSchema = z.infer<typeof editServiceSchema>;
