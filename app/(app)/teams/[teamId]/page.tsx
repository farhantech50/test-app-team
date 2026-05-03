"use client";

import { use, useEffect, useState } from "react";
import api from "@/lib/axios";

type Team = {
  id: string;
  name: string;
  description: string | null;
  _count: {
    members: number;
    projects: number;
  };
};

export default function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const [team, setTeam] = useState<Team | null>(null);
  const { teamId } = use(params);
  useEffect(() => {
    api.get(`/teams/${teamId}`).then((r) => setTeam(r.data));
  }, [teamId]);

  if (!team) return <div>Loading...</div>;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <h1 className="text-2xl font-bold">{team.name}</h1>
      {team.description && (
        <p className="text-gray-500 text-sm mt-1">{team.description}</p>
      )}
      <div className="flex gap-4 mt-4 text-sm text-gray-400">
        <span>{team._count.members} members</span>
        <span>{team._count.projects} projects</span>
      </div>
    </div>
  );
}
