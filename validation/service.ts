import { enumVariableType } from "@/db/schema";
import z from "zod";

export const envVariableTypeEnum = z.enum(enumVariableType.enumValues);

export type EnvVariableTypes = z.infer<typeof envVariableTypeEnum>;

export const createItemSchema = z.object({
  name: z.string().min(1, "name is required"),
  description: z.string().optional().default(""),
});

export const envVariableSchema = z.object({
  env_variables: z
    .array(
      z.object({
        key: z.string().min(1),
        defaultValue: z.string().optional(),
        required: z.boolean().default(false),
        type: envVariableTypeEnum,
      }),
    )
    .min(1),
});

export const updateServiceSchema = createItemSchema.extend({
  service_id: z.uuid(),
});

export type CreateItemSchema = z.infer<typeof createItemSchema>;

export type EnvVariableSchema = z.infer<typeof envVariableSchema>;

export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;
