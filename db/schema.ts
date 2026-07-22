import { defineRelations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
  bigint,
  integer,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

export const workspaceRole = pgEnum("workspace_role", [
  "owner",
  "admin",
  "member",
]);

export const integrationProvider = pgEnum("integration_provider", [
  "github",
  "slack",
  "linear",
  "sentry",
]);

export const integrationStatus = pgEnum("integration_status", [
  "connected",
  "disconnected",
  "degraded",
]);

export const executionStatus = pgEnum("execution_status", [
  "queued",
  "running",
  "success",
  "failed",
  "timed_out",
  "skipped",
  "awaiting_confirmation",
]);

export const agentRunStatus = pgEnum("agent_run_status", [
  "running",
  "completed",
  "partial",
  "failed",
  "timed_out",
]);

export const agentType = pgEnum("agent_type", ["incident_responder", "custom"]);

export const apiKeyScope = pgEnum("api_key_scope", ["read", "write", "admin"]);

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

export const session = pgTable(
  "session",
  {
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
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
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
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const workspace = pgTable(
  "workspace",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** Unique token used to namespace inbound webhook URLs for this workspace */
    webhookToken: text("webhook_token").$defaultFn(() => crypto.randomUUID()),
    ai_tokens_used: bigint("ai_tokens_used", { mode: "number" })
      .default(0)
      .notNull(),
    nl_gens_used: bigint("nl_gens_used", { mode: "number" })
      .default(0)
      .notNull(),
    /** Soft cap: warn user when AI token usage reaches this threshold */
    ai_token_limit: bigint("ai_token_limit", { mode: "number" })
      .default(2_000_000)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("workspace_ownerId_idx").on(table.ownerId),
    uniqueIndex("workspace_ownerId_name_idx").on(table.ownerId, table.name),
    uniqueIndex("workspace_webhookToken_idx").on(table.webhookToken),
  ],
);

export const workspaceMember = pgTable(
  "workspace_member",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: workspaceRole("role").notNull().default("member"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("workspace_member_userId_idx").on(table.userId),
    index("workspace_member_workspaceId_idx").on(table.workspaceId),
    uniqueIndex("workspace_member_workspaceId_userId_idx").on(
      table.workspaceId,
      table.userId,
    ),
  ],
);

export const integrations = pgTable(
  "integrations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    provider: integrationProvider("provider").notNull(),
    status: integrationStatus("status").notNull().default("connected"),
    /** AES-256-GCM encrypted access token (format: iv:authTag:ciphertext, base64) */
    accessTokenEnc: text("access_token_enc"),
    /** AES-256-GCM encrypted refresh token */
    refreshTokenEnc: text("refresh_token_enc"),
    tokenExpiresAt: timestamp("token_expires_at"),
    /** Space-separated OAuth scopes granted */
    scopes: text("scopes"),
    /** Raw webhook secret used for HMAC signature verification (encrypted) */
    webhookSecretEnc: text("webhook_secret_enc"),
    /** Provider-specific account/installation ID (e.g. GitHub installation ID) */
    providerAccountId: text("provider_account_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("integrations_workspaceId_idx").on(table.workspaceId),
    // One connection per provider per workspace
    uniqueIndex("integrations_workspaceId_provider_idx").on(
      table.workspaceId,
      table.provider,
    ),
  ],
);

export const workflows = pgTable(
  "workflows",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    active: boolean("active").default(false).notNull(),
    /** React Flow graph (nodes + edges) used by the visual editor */
    graph: jsonb("graph").notNull(),
    /**
     * Canonical workflow definition (trigger + actions array).
     * Validated against the workflow JSON schema before activation.
     */
    definition: jsonb("definition"),
    /** Schema version of the definition JSON for future migrations */
    version: integer("version").default(1).notNull(),
    /** If this workflow was generated by the NL builder, stores the original prompt */
    nlPrompt: text("nl_prompt"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("workflows_workspaceId_idx").on(table.workspaceId),
    index("workflows_createdBy_idx").on(table.createdBy),
    uniqueIndex("workflows_workspaceId_name_idx").on(
      table.workspaceId,
      table.name,
    ),
  ],
);

export const executions = pgTable(
  "executions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    workflowId: text("workflow_id")
      .notNull()
      .references(() => workflows.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    status: executionStatus("status").notNull().default("queued"),
    triggerEventType: text("trigger_event_type").notNull(),
    triggerProvider: integrationProvider("trigger_provider").notNull(),
    /** Scrubbed inbound webhook payload that initiated this execution */
    triggerPayload: jsonb("trigger_payload").notNull(),
    /**
     * Delivery/event ID from the provider used for idempotency deduplication.
     * e.g. GitHub's X-GitHub-Delivery header value.
     */
    idempotencyKey: text("idempotency_key"),
    /** Per-step execution details array */
    steps: jsonb("steps").default([]).notNull(),
    queuedAt: timestamp("queued_at").defaultNow().notNull(),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("executions_workspaceId_idx").on(table.workspaceId),
    index("executions_workflowId_idx").on(table.workflowId),
    index("executions_status_idx").on(table.status),
    // Enforce idempotency: one execution per delivery per workflow
    uniqueIndex("executions_workflowId_idempotencyKey_idx").on(
      table.workflowId,
      table.idempotencyKey,
    ),
  ],
);

export const agentRuns = pgTable(
  "agent_runs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    executionId: text("execution_id")
      .notNull()
      .references(() => executions.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    agentType: agentType("agent_type").notNull().default("incident_responder"),
    /** LLM model identifier used for this run (e.g. "claude-sonnet-4-6") */
    model: text("model").notNull(),
    /** Hardcoded system prompt snapshot at time of run */
    systemPrompt: text("system_prompt"),
    /** Ordered array of tool calls made during the ReAct loop */
    toolCalls: jsonb("tool_calls").default([]).notNull(),
    /** Structured JSON output returned by the agent as final_output */
    finalOutput: jsonb("final_output"),
    inputTokens: integer("input_tokens").default(0).notNull(),
    outputTokens: integer("output_tokens").default(0).notNull(),
    status: agentRunStatus("status").notNull().default("running"),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("agent_runs_executionId_idx").on(table.executionId),
    index("agent_runs_workspaceId_idx").on(table.workspaceId),
  ],
);

export const debugAnalyses = pgTable(
  "debug_analyses",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    executionId: text("execution_id")
      .notNull()
      .unique()
      .references(() => executions.id, { onDelete: "cascade" }),
    /**
     * Failure classification:
     * expired_oauth_token | webhook_misconfiguration | missing_scope |
     * template_field_not_found | rate_limited | transient_network | platform_error
     */
    failureClass: text("failure_class").notNull(),
    /** Plain-English one-sentence explanation of the failure */
    explanation: text("explanation").notNull(),
    /** Specific fix instruction for the user */
    fixInstruction: text("fix_instruction").notNull(),
    /** Deep-link to the relevant settings page (e.g. /settings/integrations/linear) */
    settingsLink: text("settings_link"),
    /** True when the step is already queued for automatic retry */
    autoRetrying: boolean("auto_retrying").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("debug_analyses_executionId_idx").on(table.executionId)],
);

export const apiKeys = pgTable(
  "api_keys",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    /** SHA-256 hash of the raw API key */
    keyHash: text("key_hash").notNull().unique(),
    scope: apiKeyScope("scope").notNull().default("read"),
    lastUsedAt: timestamp("last_used_at"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("api_keys_workspaceId_idx").on(table.workspaceId),
    index("api_keys_createdBy_idx").on(table.createdBy),
  ],
);

export const relations = defineRelations(
  {
    user,
    session,
    account,
    workspace,
    workspaceMember,
    workflows,
    integrations,
    executions,
    agentRuns,
    debugAnalyses,
    apiKeys,
  },
  (r) => ({
    user: {
      sessions: r.many.session(),
      accounts: r.many.account(),
      ownedWorkspaces: r.many.workspace({
        from: r.user.id,
        to: r.workspace.ownerId,
      }),
      workspaceMemberships: r.many.workspaceMember(),
      workflows: r.many.workflows({
        from: r.user.id,
        to: r.workflows.createdBy,
      }),
      apiKeys: r.many.apiKeys({
        from: r.user.id,
        to: r.apiKeys.createdBy,
      }),
    },
    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id,
      }),
    },
    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id,
      }),
    },
    workspace: {
      owner: r.one.user({
        from: r.workspace.ownerId,
        to: r.user.id,
      }),
      members: r.many.workspaceMember(),
      workflows: r.many.workflows(),
      integrations: r.many.integrations(),
      executions: r.many.executions(),
      agentRuns: r.many.agentRuns(),
      apiKeys: r.many.apiKeys(),
    },
    workspaceMember: {
      workspace: r.one.workspace({
        from: r.workspaceMember.workspaceId,
        to: r.workspace.id,
      }),
      user: r.one.user({
        from: r.workspaceMember.userId,
        to: r.user.id,
      }),
    },
    workflows: {
      workspace: r.one.workspace({
        from: r.workflows.workspaceId,
        to: r.workspace.id,
      }),
      creator: r.one.user({
        from: r.workflows.createdBy,
        to: r.user.id,
      }),
      executions: r.many.executions(),
    },
    integrations: {
      workspace: r.one.workspace({
        from: r.integrations.workspaceId,
        to: r.workspace.id,
      }),
    },
    executions: {
      workflow: r.one.workflows({
        from: r.executions.workflowId,
        to: r.workflows.id,
      }),
      workspace: r.one.workspace({
        from: r.executions.workspaceId,
        to: r.workspace.id,
      }),
      agentRuns: r.many.agentRuns(),
      debugAnalysis: r.one.debugAnalyses({
        from: r.executions.id,
        to: r.debugAnalyses.executionId,
      }),
    },
    agentRuns: {
      execution: r.one.executions({
        from: r.agentRuns.executionId,
        to: r.executions.id,
      }),
      workspace: r.one.workspace({
        from: r.agentRuns.workspaceId,
        to: r.workspace.id,
      }),
    },
    debugAnalyses: {
      execution: r.one.executions({
        from: r.debugAnalyses.executionId,
        to: r.executions.id,
      }),
    },
    apiKeys: {
      workspace: r.one.workspace({
        from: r.apiKeys.workspaceId,
        to: r.workspace.id,
      }),
      createdByUser: r.one.user({
        from: r.apiKeys.createdBy,
        to: r.user.id,
      }),
    },
  }),
);
