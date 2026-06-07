import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects, Project } from "@/lib/projectsStore";
import { randomUUID } from "crypto";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Project> & {
    title?: string;
    description?: string;
    cover?: string;
    images?: string[];
    mediaType?: "image" | "video" | "both";
    video?: string;
  };

  if (!body.description || !body.cover) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const now = new Date().toISOString();

  const mediaType: "image" | "video" | "both" =
    body.mediaType === "video" || body.mediaType === "both" ? body.mediaType : "image";

  if ((mediaType === "video" || mediaType === "both") && !body.video) {
    return NextResponse.json({ error: "Missing video filename" }, { status: 400 });
  }

  const images = Array.isArray(body.images) ? body.images : [];

  const project: Project = {
    id: body.id ?? randomUUID(),
    title: body.title ?? "",
    description: body.description,
    cover: body.cover,
    images: mediaType === "image" || mediaType === "both" ? images : [],
    mediaType,
    video: mediaType === "video" || mediaType === "both" ? body.video : undefined,
    createdAt: now,
    updatedAt: now,
  };

  const projects = await getProjects();
  projects.push(project);
  await saveProjects(projects);

  return NextResponse.json(project, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as Partial<Project> & { id?: string };

  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const current = projects[index];
  const updated: Project = {
    ...current,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  projects[index] = updated;
  await saveProjects(projects);

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { id?: string } | null;
  const id = body?.id;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  projects.splice(index, 1);
  await saveProjects(projects);

  return NextResponse.json({ ok: true });
}
