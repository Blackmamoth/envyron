import z from "zod";
import { enumVariableType } from "@/db/schema";

export const envVariableTypeEnum = z.enum(enumVariableType.enumValues);

export type EnvVariableTypes = z.infer<typeof envVariableTypeEnum>;

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

export type CreateItemSchema = z.infer<typeof createItemSchema>;

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export type DeleteItemSchema = z.infer<typeof deleteItemSchema>;

export type EnvVariableSchema = z.infer<typeof envVariableSchema>;

export type UpdateItemSchema = z.infer<typeof updateItemSchema>;

export type SyncTemplateSchema = z.infer<typeof syncTemplateSchema>;

export type SyncProjectSchema = z.infer<typeof syncProjectSchema>;
