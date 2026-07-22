"use server";

import { db } from "@/db";
import { workflows } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getWorkflows = async (workspaceId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) return { error: "Unauthorized" };

    const userExists = await db.query.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    if (!userExists) return { error: "User not found" };

    const workspaceMember = await db.query.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!workspaceMember) return { error: "User not found" };

    const workflowList = await db.query.workflows.findMany({
      where: {
        workspaceId,
      },
    });

    return { workflows: workflowList };
  } catch (error) {
    console.error(error);
    return { error: "Failed to get workflows" };
  }
};

export const createWorkflow = async (workspaceId: string, name: string) => {
  try {
    if (!name || name.trim() === "") {
      return { error: "Workflow name is required" };
    }

    if (name.length > 50) {
      return { error: "Workflow name must be less than 50 characters" };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const workspaceMember = await db.query.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!workspaceMember) {
      return { error: "You do not have access to this workspace" };
    }

    const [newWorkflow] = await db
      .insert(workflows)
      .values({
        name: name.trim(),
        workspaceId,
        createdBy: session.user.id,
        graph: { nodes: [], edges: [] },
      })
      .returning();

    return { workflow: newWorkflow };
  } catch (error) {
    console.error("Error creating workflow:", error);
    return { error: "Failed to create workflow" };
  }
};
