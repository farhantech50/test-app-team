// components/Navbar.tsx
"use client";

import api from "@/lib/axios";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await api.post("/auth/logout");

      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };
  return (
    <header className="h-14 border-b border-gray-100 bg-white flex items-center px-6 justify-between shrink-0">
      <Link href="/dashboard" className="font-bold text-lg tracking-tight">
        Nexus
      </Link>

      <button
        onClick={handleSignOut}
        className="p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </header>
  );
}
