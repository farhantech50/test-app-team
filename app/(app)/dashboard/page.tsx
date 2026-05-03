"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/auth/userInfo");
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();

    window.addEventListener("focus", fetchUser);

    return () => {
      window.removeEventListener("focus", fetchUser);
    };
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p>ID: {user.id}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
