CREATE TYPE "agent_run_status" AS ENUM('running', 'completed', 'partial', 'failed', 'timed_out');--> statement-breakpoint
CREATE TYPE "agent_type" AS ENUM('incident_responder', 'custom');--> statement-breakpoint
CREATE TYPE "api_key_scope" AS ENUM('read', 'write', 'admin');--> statement-breakpoint
CREATE TYPE "execution_status" AS ENUM('queued', 'running', 'success', 'failed', 'timed_out', 'skipped', 'awaiting_confirmation');--> statement-breakpoint
CREATE TYPE "integration_provider" AS ENUM('github', 'slack', 'linear', 'jira', 'sentry', 'pagerduty', 'vercel');--> statement-breakpoint
CREATE TYPE "integration_status" AS ENUM('connected', 'disconnected', 'degraded');--> statement-breakpoint
CREATE TABLE "agent_runs" (
	"id" text PRIMARY KEY,
	"execution_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"agent_type" "agent_type" DEFAULT 'incident_responder'::"agent_type" NOT NULL,
	"model" text NOT NULL,
	"system_prompt" text,
	"tool_calls" jsonb DEFAULT '[]' NOT NULL,
	"final_output" jsonb,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"status" "agent_run_status" DEFAULT 'running'::"agent_run_status" NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" text PRIMARY KEY,
	"workspace_id" text NOT NULL,
	"created_by" text,
	"name" text NOT NULL,
	"key_hash" text NOT NULL UNIQUE,
	"scope" "api_key_scope" DEFAULT 'read'::"api_key_scope" NOT NULL,
	"last_used_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "debug_analyses" (
	"id" text PRIMARY KEY,
	"execution_id" text NOT NULL UNIQUE,
	"failure_class" text NOT NULL,
	"explanation" text NOT NULL,
	"fix_instruction" text NOT NULL,
	"settings_link" text,
	"auto_retrying" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "executions" (
	"id" text PRIMARY KEY,
	"workflow_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"status" "execution_status" DEFAULT 'queued'::"execution_status" NOT NULL,
	"trigger_event_type" text NOT NULL,
	"trigger_provider" "integration_provider" NOT NULL,
	"trigger_payload" jsonb NOT NULL,
	"idempotency_key" text,
	"steps" jsonb DEFAULT '[]' NOT NULL,
	"queued_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" text PRIMARY KEY,
	"workspace_id" text NOT NULL,
	"provider" "integration_provider" NOT NULL,
	"status" "integration_status" DEFAULT 'connected'::"integration_status" NOT NULL,
	"access_token_enc" text,
	"refresh_token_enc" text,
	"token_expires_at" timestamp,
	"scopes" text,
	"webhook_secret_enc" text,
	"provider_account_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflows" ADD COLUMN "active" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "workflows" ADD COLUMN "definition" jsonb;--> statement-breakpoint
ALTER TABLE "workflows" ADD COLUMN "version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "workflows" ADD COLUMN "nl_prompt" text;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "webhook_token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "ai_token_limit" bigint DEFAULT 2000000 NOT NULL;--> statement-breakpoint
CREATE INDEX "agent_runs_executionId_idx" ON "agent_runs" ("execution_id");--> statement-breakpoint
CREATE INDEX "agent_runs_workspaceId_idx" ON "agent_runs" ("workspace_id");--> statement-breakpoint
CREATE INDEX "api_keys_workspaceId_idx" ON "api_keys" ("workspace_id");--> statement-breakpoint
CREATE INDEX "api_keys_createdBy_idx" ON "api_keys" ("created_by");--> statement-breakpoint
CREATE INDEX "debug_analyses_executionId_idx" ON "debug_analyses" ("execution_id");--> statement-breakpoint
CREATE INDEX "executions_workspaceId_idx" ON "executions" ("workspace_id");--> statement-breakpoint
CREATE INDEX "executions_workflowId_idx" ON "executions" ("workflow_id");--> statement-breakpoint
CREATE INDEX "executions_status_idx" ON "executions" ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "executions_workflowId_idempotencyKey_idx" ON "executions" ("workflow_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "integrations_workspaceId_idx" ON "integrations" ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "integrations_workspaceId_provider_idx" ON "integrations" ("workspace_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_webhookToken_idx" ON "workspace" ("webhook_token");--> statement-breakpoint
ALTER TABLE "agent_runs" ADD CONSTRAINT "agent_runs_execution_id_executions_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "executions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "agent_runs" ADD CONSTRAINT "agent_runs_workspace_id_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_workspace_id_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_created_by_user_id_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "debug_analyses" ADD CONSTRAINT "debug_analyses_execution_id_executions_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "executions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "executions" ADD CONSTRAINT "executions_workflow_id_workflows_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "executions" ADD CONSTRAINT "executions_workspace_id_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_workspace_id_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;