"use server";

import { db } from "@/db";
import { workspace, workspaceMember } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const createWorkspace = async (name: string) => {
  try {
    if (!name || name.trim() === "") {
      return { error: "Name is required" };
    }

    if (name.length > 50) {
      return { error: "Name is too long" };
    }

    if (name.length < 3) {
      return { error: "Name is too short" };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const newWorkspace = await db
      .insert(workspace)
      .values({
        ownerId: session.user.id,
        name: name,
      })
      .returning();

    await db.insert(workspaceMember).values({
      workspaceId: newWorkspace[0].id,
      userId: session.user.id,
      role: "owner",
    });

    return {
      success: "Workspace created successfully",
      workspace: newWorkspace[0],
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create workspace" };
  }
};

export const getWorkSpaces = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const userExists = await db.query.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    if (!userExists) {
      return { error: "User not found" };
    }

    const workspaces = await db.query.workspaceMember.findMany({
      where: {
        userId: session.user.id,
      },
      columns: {
        role: true,
      },
      with: {
        workspace: {
          columns: { name: true, id: true },
        },
      },
    });

    return { workspaces };
  } catch (error) {
    console.error(error);
    return { error: "Failed to get workspaces" };
  }
};

export const getWorkspaceById = async (workspaceId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const userExists = await db.query.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    if (!userExists) {
      return { error: "User not found" };
    }

    const workspace = await db.query.workspace.findFirst({
      where: {
        id: workspaceId,
      },
      columns: {
        id: true,
        name: true,
        ai_tokens_used: true,
        nl_gens_used: true,
      },
      with: {
        members: {
          columns: {},
          with: {
            user: {
              columns: { image: true, name: true, email: true },
            },
          },
        },
        owner: {
          columns: { image: true, name: true, email: true },
        },
      },
    });

    return { workspace };
  } catch (error) {
    console.error(error);
    return { error: "Failed to get workspace" };
  }
};
