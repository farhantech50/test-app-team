"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

type Project = {
  id: string;
  name: string;
  description: string | null;
  team: {
    id: string;
    name: string;
  };
  _count: {
    tasks: number;
  };
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/projects").then((r) => {
      setProjects(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No projects yet</p>
          <p className="text-sm mt-1">Create a project from a team page</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-white border border-gray-100 rounded-xl p-6 hover:border-gray-300 transition-colors"
            >
              <div className="text-xs text-gray-400 mb-2">
                {project.team.name}
              </div>
              <h2 className="font-semibold text-lg mb-1">{project.name}</h2>
              {project.description && (
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}
              <div className="text-sm text-gray-400 mt-4">
                {project._count.tasks} tasks
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
