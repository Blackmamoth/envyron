CREATE TYPE "public"."variable_type" AS ENUM('STRING', 'INT', 'FLOAT', 'BOOLEAN', 'URL', 'EMAIL', 'DURATION', 'FILEPATH', 'ARRAY', 'JSON');--> statement-breakpoint
CREATE TABLE "env_variable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service" uuid NOT NULL,
	"key" text NOT NULL,
	"default_value" text DEFAULT '' NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"type" "variable_type" DEFAULT 'STRING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user" text NOT NULL,
	"description" text,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_composition" (
	"template_id" uuid NOT NULL,
	"service" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "template_composition_template_id_service_pk" PRIMARY KEY("template_id","service")
);
--> statement-breakpoint
ALTER TABLE "env_variable" ADD CONSTRAINT "env_variable_service_service_id_fk" FOREIGN KEY ("service") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template" ADD CONSTRAINT "template_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_composition" ADD CONSTRAINT "template_composition_template_id_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."template"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_composition" ADD CONSTRAINT "template_composition_service_service_id_fk" FOREIGN KEY ("service") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;