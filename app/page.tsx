import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-linear-to-b from-gray-50 to-white">
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-in"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-black text-white font-medium hover:opacity-90 transition"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-900 font-medium hover:bg-gray-100 transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
