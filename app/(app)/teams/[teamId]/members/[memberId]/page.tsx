"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type Task = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string | null;
  project: {
    id: string;
    name: string;
  };
};

type Member = {
  id: string;
  team: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    tasks: Task[];
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

export default function MemberProfilePage({
  params,
}: {
  params: Promise<{ teamId: string; memberId: string }>;
}) {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { teamId, memberId } = await params;

      try {
        const { data } = await api.get(`/teams/${teamId}/members/${memberId}`);
        setMember(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!member) return <div className="text-red-500">Member not found</div>;

  return (
    <div className="max-w-2xl">
      {/* back button */}
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-400 hover:text-black transition-colors mb-6 flex items-center gap-1"
      >
        ← Back
      </button>

      {/* member info */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold">
            {member.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold">{member.user.name}</h1>
            <p className="text-gray-400 text-sm">{member.user.email}</p>
            <p className="text-gray-400 text-xs mt-1">
              Team: {member.team.name}
            </p>
          </div>
        </div>
      </div>

      {/* tasks */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4">
          Assigned Tasks{" "}
          <span className="text-gray-400 font-normal text-sm">
            ({member.user.tasks.length})
          </span>
        </h2>

        {member.user.tasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks assigned</p>
        ) : (
          <ul className="space-y-3">
            {member.user.tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {task.project.name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
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
