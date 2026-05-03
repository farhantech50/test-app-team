// app/(app)/teams/[teamId]/@projects/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProjectsSlot({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  const projects = await prisma.project.findMany({
    where: { teamId },
    include: {
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Projects</h2>
        <Link
          href={`/teams/${teamId}/projects/create`}
          className="text-sm bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400 text-sm">No projects yet</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{project.name}</p>
                  {project.description && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {project.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {project._count.tasks} tasks
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
