"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type Section = "profile" | "account";

const sections = [
  { label: "Profile", slug: "profile" },
  { label: "Account", slug: "account" },
];

function ProfileSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/userInfo").then((r) => {
      setName(r.data.name);
      setEmail(r.data.email);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4 max-w-md">
      <h2 className="text-lg font-semibold">Profile</h2>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>
      <button className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
        Save Changes
      </button>
    </div>
  );
}

function AccountSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div className="space-y-4 max-w-md">
      <h2 className="text-lg font-semibold">Account</h2>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>
      <button className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
        Update Password
      </button>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-red-500 mb-2">Danger Zone</h3>
        <button className="border border-red-200 text-red-500 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("profile");

  useEffect(() => {
    const init = async () => {
      const { slug } = await params;
      const current = slug?.[0] as Section;
      if (current && ["profile", "account"].includes(current)) {
        setSection(current);
      } else {
        router.replace("/settings/profile");
      }
    };
    init();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex gap-8">
        {/* settings sidebar */}
        <aside className="w-40 shrink-0">
          <nav className="flex flex-col gap-1">
            {sections.map((s) => (
              <button
                key={s.slug}
                onClick={() => {
                  setSection(s.slug as Section);
                  router.push(`/settings/${s.slug}`);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  section === s.slug
                    ? "bg-gray-100 text-black font-medium"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* settings content */}
        <div className="flex-1">
          {section === "profile" && <ProfileSettings />}
          {section === "account" && <AccountSettings />}
        </div>
      </div>
    </div>
  );
}
