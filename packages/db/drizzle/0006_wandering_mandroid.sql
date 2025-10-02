ALTER TABLE "project" DROP CONSTRAINT "project_template_template_id_fk";
--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_template_template_id_fk" FOREIGN KEY ("template") REFERENCES "public"."template"("id") ON DELETE no action ON UPDATE no action;