import { ReactNode } from "react";

export default function TeamLayout({
  children,
  members,
  projects,
}: {
  children: ReactNode;
  members: ReactNode;
  projects: ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* team info */}
      {children}

      {/* parallel slots */}
      <div className="grid grid-cols-2 gap-6">
        {members}
        {projects}
      </div>
    </div>
  );
}
