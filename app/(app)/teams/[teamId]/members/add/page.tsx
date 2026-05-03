"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { addMembers } from "@/app/actions/member";
import { useTriggerRefreshStore } from "@/store/triggerRefreshStore";
type User = {
  id: string;
  name: string;
  email: string;
};

export default function AddMembersPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const router = useRouter();
  const [teamId, setTeamId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { triggerRefresh, setTriggerRefresh } = useTriggerRefreshStore();
  useEffect(() => {
    const init = async () => {
      const { teamId } = await params;
      setTeamId(teamId);

      const [allUsers, members] = await Promise.all([
        api.get("/auth/userInfo?all=true").then((r) => r.data),
        api.get(`/teams/${teamId}/members`).then((r) => r.data),
      ]);

      const existingIds = members.map((m: any) => m.user.id);
      const available = allUsers.filter(
        (u: User) => !existingIds.includes(u.id),
      );

      setUsers(available);
      setLoading(false);
    };

    init();
  }, [triggerRefresh]);

  const toggleSelect = (userId: string) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) return;
    setSubmitting(true);

    try {
      await addMembers(teamId, selected); // server action
      // optimistic UI update
      setUsers((prev) => prev.filter((u) => !selected.includes(u.id)));
      setSelected([]);
      // optional background sync
      router.refresh();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Members</h1>
        <p className="text-gray-500 text-sm mt-1">
          Select users to add to this team
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6">
        {users.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No users available to add
          </p>
        ) : (
          <ul className="space-y-2 mb-6">
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => toggleSelect(user.id)}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                  selected.includes(user.id)
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(user.id)}
                  onChange={() => toggleSelect(user.id)}
                  className="w-4 h-4 accent-black"
                />
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={selected.length === 0 || submitting}
            className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {submitting
              ? "Adding..."
              : `Add ${selected.length > 0 ? selected.length : ""} Member${selected.length !== 1 ? "s" : ""}`}
          </button>

          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
