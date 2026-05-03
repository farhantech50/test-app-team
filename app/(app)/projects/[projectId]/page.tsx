"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string | null;
  assignee: {
    id: string;
    name: string;
  } | null;
};

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

const statusStyles = {
  TODO: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-100 text-blue-600",
  DONE: "bg-green-100 text-green-600",
};

const statusLabels = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/projects/${projectId}`).then((r) => r.data),
      api.get(`/projects/${projectId}/tasks`).then((r) => r.data),
    ]).then(([projectData, tasksData]) => {
      setProject(projectData);
      setTasks(tasksData);
      setLoading(false);
    });
  }, [projectId]);

  if (loading) return <div>Loading...</div>;
  if (!project) return <div className="text-red-500">Project not found</div>;

  return (
    <div className="max-w-3xl">
      {/* project header */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">
              <Link
                href={`/teams/${project.team.id}`}
                className="hover:text-black transition-colors"
              >
                {project.team.name}
              </Link>
              {" / "}
              {project.name}
            </div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="text-gray-500 text-sm mt-1">
                {project.description}
              </p>
            )}
          </div>

          <Link
            href={`/projects/${projectId}/tasks/create`}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shrink-0"
          >
            Add Task
          </Link>
        </div>

        <div className="flex gap-4 mt-4 text-sm text-gray-400">
          <span>{project._count.tasks} tasks</span>
        </div>
      </div>

      {/* tasks */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4">Tasks</h2>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No tasks yet</p>
            <Link
              href={`/projects/${projectId}/tasks/create`}
              className="text-sm text-black underline underline-offset-2 mt-2 inline-block"
            >
              Create your first task
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                  {task.assignee && (
                    <p className="text-xs text-gray-400 mt-1">
                      Assigned to {task.assignee.name}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {task.dueDate && (
                    <span className="text-xs text-gray-400">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[task.status]}`}
                  >
                    {statusLabels[task.status]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
