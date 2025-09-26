import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const enumVariableType = pgEnum("variable_type", [
  "STRING",
  "INT",
  "FLOAT",
  "BOOLEAN",
  "URL",
  "EMAIL",
  "DURATION",
  "FILEPATH",
  "ARRAY",
  "JSON",
]);

export const service = pgTable("service", {
  id: uuid("id").primaryKey().defaultRandom(),
  user: text("user")
    .references(() => user.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const envVariable = pgTable(
  "env_variable",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    service: uuid("service")
      .references(() => service.id, { onDelete: "cascade" })
      .notNull(),
    key: text("key").notNull(),
    defaultValue: text("default_value").default("").notNull(),
    required: boolean().default(false).notNull(),
    type: enumVariableType().default("STRING").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return [uniqueIndex("service_key_unique").on(table.service, table.key)];
  },
);

export const template = pgTable("template", {
  id: uuid("id").primaryKey().defaultRandom(),
  user: text("user")
    .references(() => user.id)
    .notNull(),
  description: text("description"),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const templateComposition = pgTable(
  "template_composition",
  {
    template: uuid("template")
      .references(() => template.id, { onDelete: "cascade" })
      .notNull(),
    service: uuid("service")
      .references(() => service.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.template, table.service] })],
);

export const project = pgTable(
  "project",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    user: text("user")
      .references(() => user.id)
      .notNull(),
    template: uuid("template").references(() => template.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("projectname_user_unique").on(table.name, table.user),
  ],
);

export const projectComposition = pgTable(
  "project_composition",
  {
    project: uuid("project")
      .references(() => project.id, { onDelete: "cascade" })
      .notNull(),
    service: uuid("service")
      .references(() => service.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.project, table.service] })],
);

export type Service = InferSelectModel<typeof service>;

export type EnvVariable = InferSelectModel<typeof envVariable>;

export type Template = InferSelectModel<typeof template>;

export type TemplateComposition = InferSelectModel<typeof templateComposition>;

export type Project = InferSelectModel<typeof project>;

export type ProjectComposition = InferSelectModel<typeof projectComposition>;

export type EnumVariableTypes = (typeof enumVariableType.enumValues)[number];
