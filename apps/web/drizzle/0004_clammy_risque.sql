ALTER TABLE "env_variable" DROP CONSTRAINT "env_variable_service_service_id_fk";
--> statement-breakpoint
ALTER TABLE "project_composition" DROP CONSTRAINT "project_composition_project_project_id_fk";
--> statement-breakpoint
ALTER TABLE "project_composition" DROP CONSTRAINT "project_composition_service_service_id_fk";
--> statement-breakpoint
ALTER TABLE "template_composition" DROP CONSTRAINT "template_composition_template_id_template_id_fk";
--> statement-breakpoint
ALTER TABLE "template_composition" DROP CONSTRAINT "template_composition_service_service_id_fk";
--> statement-breakpoint
ALTER TABLE "env_variable" ADD CONSTRAINT "env_variable_service_service_id_fk" FOREIGN KEY ("service") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_composition" ADD CONSTRAINT "project_composition_project_project_id_fk" FOREIGN KEY ("project") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_composition" ADD CONSTRAINT "project_composition_service_service_id_fk" FOREIGN KEY ("service") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_composition" ADD CONSTRAINT "template_composition_template_id_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_composition" ADD CONSTRAINT "template_composition_service_service_id_fk" FOREIGN KEY ("service") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;