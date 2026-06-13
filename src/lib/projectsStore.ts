import fs from "fs/promises";
import path from "path";

export type Project = {
  id: string;
  title: string;
  description: string;
  cover: string;
  images: string[];
  mediaType?: "image" | "video" | "both";
  video?: string;
  createdAt: string;
  updatedAt: string;
};

const PROJECTS_PATH = path.join(process.cwd(), "data", "projects.json");

async function readProjectsFile(): Promise<Project[]> {
  try {
    const raw = await fs.readFile(PROJECTS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as Project[];
    }
  } catch {
    // ignore and fall back
  }
  return [];
}

async function writeProjectsFile(projects: Project[]): Promise<void> {
  await fs.writeFile(PROJECTS_PATH, JSON.stringify(projects, null, 2), "utf8");
}

function getProjectMediaCount(project: Project): number {
  const imageCount = Array.isArray(project.images) ? project.images.length : 0;
  const videoCount = project.video ? 1 : 0;
  return imageCount + videoCount;
}

export async function getProjects(): Promise<Project[]> {
  const projects = await readProjectsFile();
  const distortionProject = projects.find((p) => p.title === "失真");
  const otherProjects = projects.filter((p) => p.title !== "失真");
  const sortedOthers = otherProjects
    .slice()
    .sort((a, b) => getProjectMediaCount(b) - getProjectMediaCount(a));
  return distortionProject ? [distortionProject, ...sortedOthers] : sortedOthers;
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await writeProjectsFile(projects);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await readProjectsFile();
  return projects.find((p) => p.id === id);
}

export async function updateProject(
  id: string,
  data: { title?: string; description?: string },
): Promise<Project | null> {
  const projects = await readProjectsFile();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = projects[index];
  const updated: Project = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  projects[index] = updated;
  await writeProjectsFile(projects);
  return updated;
}
