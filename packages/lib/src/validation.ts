import z from "zod";
import { enumVariableType } from "@envyron/db/schema";

export const envVariableTypeEnum = z.enum(enumVariableType.enumValues);

export const createItemSchema = z.object({
  name: z.string().min(1, "name is required"),
  description: z.string().optional(),
});

export const createProjectSchema = createItemSchema.extend({
  template: z.uuid().optional(),
});

export const deleteItemSchema = z.object({
  id: z.uuid(),
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

export const syncTemplateSchema = z.object({
  services: z.array(z.uuid()),
});

export const syncProjectSchema = syncTemplateSchema.clone();

export const updateItemSchema = createItemSchema.extend({
  item_id: z.uuid(),
});
