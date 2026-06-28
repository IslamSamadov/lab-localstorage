"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // Decode JWT token client-side
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);

      if (payload && payload.email) {
        setEmail(payload.email);
        setLoading(false);
      } else {
        // Token format was invalid/empty
        localStorage.removeItem("token");
        router.push("/login");
      }
    } catch (err) {
      // Token is malformed
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-8 bg-linear-to-b from-zinc-900 to-zinc-950 text-white min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-zinc-400 text-sm animate-pulse">Verifying secure session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-8 bg-linear-to-b from-zinc-900 to-zinc-950 text-white min-h-screen">
      <div className="w-full max-w-lg bg-zinc-900/50 border border-zinc-800 backdrop-blur-md rounded-2xl p-10 shadow-2xl space-y-8 text-center transition-all duration-300 hover:border-zinc-700/50">
        <div className="mx-auto w-16 h-16 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center shadow-inner">
          <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            You are in, my friend
          </h1>
          <p className="text-zinc-400 text-sm">
            This protected zone is only visible to authenticated sessions.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/60 inline-flex flex-col items-center gap-1">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Logged in as</span>
          <span id="user-email" className="font-mono text-zinc-200 text-base font-medium">{email}</span>
        </div>

        <div>
          <button
            id="logout-btn"
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] border border-zinc-700 text-zinc-200 px-8 py-3 font-semibold transition-all cursor-pointer shadow-lg hover:shadow-zinc-900/40"
          >
            Log out
          </button>
        </div>
      </div>
    </main>
  );
}

