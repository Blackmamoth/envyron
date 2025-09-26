ALTER TABLE "template_composition" RENAME COLUMN "template_id" TO "template";--> statement-breakpoint
ALTER TABLE "template_composition" DROP CONSTRAINT "template_composition_template_id_template_id_fk";
--> statement-breakpoint
ALTER TABLE "template_composition" DROP CONSTRAINT "template_composition_template_id_service_pk";--> statement-breakpoint
ALTER TABLE "template_composition" ADD CONSTRAINT "template_composition_template_service_pk" PRIMARY KEY("template","service");--> statement-breakpoint
ALTER TABLE "template_composition" ADD CONSTRAINT "template_composition_template_template_id_fk" FOREIGN KEY ("template") REFERENCES "public"."template"("id") ON DELETE cascade ON UPDATE no action;