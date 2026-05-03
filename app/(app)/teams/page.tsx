"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";

type Team = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count: {
    members: number;
    projects: number;
  };
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await api.get("/teams");
        setTeams(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
    window.addEventListener("focus", fetchTeams);

    return () => {
      window.removeEventListener("focus", fetchTeams);
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Teams</h1>
          <p className="text-gray-500 text-sm mt-1">
            {teams.length} team{teams.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Link
          href="/teams/create"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Create Team
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No teams yet</p>
          <p className="text-sm mt-1">Create your first team to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="bg-white border border-gray-100 rounded-xl p-6 hover:border-gray-300 transition-colors"
            >
              <h2 className="font-semibold text-lg mb-1">{team.name}</h2>
              {team.description && (
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {team.description}
                </p>
              )}
              <div className="flex gap-4 text-sm text-gray-400 mt-4">
                <span>{team._count.members} members</span>
                <span>{team._count.projects} projects</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
