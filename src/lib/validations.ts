import { z } from "zod";

export const variableSchema = z.object({
  key: z.string().min(1, "please provide a valid name for the key"),
  required: z.boolean().default(false),
});

export const serviceSchema = z.object({
  name: z.string().min(1, "please provide a valid name for the service"),
  variables: z.array(variableSchema),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;

export type VariableSchema = z.infer<typeof variableSchema>;
