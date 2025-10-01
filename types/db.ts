import type {
  enumVariableType,
  envVariable,
  project,
  projectComposition,
  service,
  template,
  templateComposition,
} from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Service = InferSelectModel<typeof service>;

export type EnvVariable = InferSelectModel<typeof envVariable>;

export type Template = InferSelectModel<typeof template>;

export type TemplateComposition = InferSelectModel<typeof templateComposition>;

export type Project = InferSelectModel<typeof project>;

export type ProjectComposition = InferSelectModel<typeof projectComposition>;

export type EnumVariableTypes = (typeof enumVariableType.enumValues)[number];
