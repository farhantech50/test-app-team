"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { removeMember } from "@/app/actions/removeMember";
import Link from "next/link";
import { useTriggerRefreshStore } from "@/store/triggerRefreshStore";

type Member = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function MembersClient({
  initialMembers,
  teamId,
}: {
  initialMembers: Member[];
  teamId: string;
}) {
  const [members, setMembers] = useState(initialMembers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { triggerRefresh, setTriggerRefresh } = useTriggerRefreshStore();
  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  const handleRemove = async (memberId: string) => {
    setLoadingId(memberId);

    try {
      await removeMember({ memberId });
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      setTriggerRefresh();
    } catch (err) {
      console.error(err);
      // optional rollback (if you want later)
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Members</h2>

        <Link
          href={`/teams/${teamId}/members/add`}
          className="text-sm bg-black text-white px-3 py-1.5 rounded-lg"
        >
          Add Member
        </Link>
      </div>

      {members.length === 0 ? (
        <p className="text-gray-400 text-sm">No members yet</p>
      ) : (
        <ul className="space-y-3">
          {members.map((member) => (
            <li key={member.id} className="flex items-center justify-between">
              <Link
                href={`/teams/${teamId}/members/${member.id}`}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-medium">{member.user.name}</p>
                  <p className="text-xs text-gray-400">{member.user.email}</p>
                </div>
              </Link>

              <button
                onClick={() => handleRemove(member.id)}
                disabled={loadingId === member.id}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
