import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects, getProjectById } from "@/lib/projectsStore";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const project = await getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const body = (await req.json()) as {
    title?: string;
    description?: string;
    images?: string[];
  };

  const projects = await getProjects();
  const { id } = await context.params;
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const current = projects[index];
  const updated = {
    ...current,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  projects[index] = updated;
  await saveProjects(projects);

  return NextResponse.json(updated);
}
