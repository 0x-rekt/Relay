CREATE TYPE "workspace_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TABLE "workspace" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"owner_id" text NOT NULL,
	"ai_tokens_used" bigint DEFAULT 0 NOT NULL,
	"nl_gens_used" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_member" (
	"id" text PRIMARY KEY,
	"workspace_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "workspace_role" DEFAULT 'member'::"workspace_role" NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "workspace_ownerId_idx" ON "workspace" ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_ownerId_name_idx" ON "workspace" ("owner_id","name");--> statement-breakpoint
CREATE INDEX "workspace_member_userId_idx" ON "workspace_member" ("user_id");--> statement-breakpoint
CREATE INDEX "workspace_member_workspaceId_idx" ON "workspace_member" ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_member_workspaceId_userId_idx" ON "workspace_member" ("workspace_id","user_id");--> statement-breakpoint
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_owner_id_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workspace_member" ADD CONSTRAINT "workspace_member_workspace_id_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workspace_member" ADD CONSTRAINT "workspace_member_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;