CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"user" text NOT NULL,
	"template" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_composition" (
	"project" uuid NOT NULL,
	"service" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_composition_project_service_pk" PRIMARY KEY("project","service")
);
--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_template_template_id_fk" FOREIGN KEY ("template") REFERENCES "public"."template"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_composition" ADD CONSTRAINT "project_composition_project_project_id_fk" FOREIGN KEY ("project") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_composition" ADD CONSTRAINT "project_composition_service_service_id_fk" FOREIGN KEY ("service") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "projectname_user_unique" ON "project" USING btree ("name","user");