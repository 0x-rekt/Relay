CREATE TABLE "workflows" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"workspace_id" text NOT NULL,
	"created_by" text,
	"graph" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "workflows_workspaceId_idx" ON "workflows" ("workspace_id");--> statement-breakpoint
CREATE INDEX "workflows_createdBy_idx" ON "workflows" ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "workflows_workspaceId_name_idx" ON "workflows" ("workspace_id","name");--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_workspace_id_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_created_by_user_id_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL;