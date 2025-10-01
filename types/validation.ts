import type {
  createItemSchema,
  createProjectSchema,
  deleteItemSchema,
  envVariableSchema,
  syncProjectSchema,
  syncTemplateSchema,
  updateItemSchema,
} from "@/lib/validation";
import type { z } from "zod";

export type CreateItemSchema = z.infer<typeof createItemSchema>;

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export type DeleteItemSchema = z.infer<typeof deleteItemSchema>;

export type EnvVariableSchema = z.infer<typeof envVariableSchema>;

export type UpdateItemSchema = z.infer<typeof updateItemSchema>;

export type SyncTemplateSchema = z.infer<typeof syncTemplateSchema>;

export type SyncProjectSchema = z.infer<typeof syncProjectSchema>;
