"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("That email or password isn't recognized. Try again.");
      return;
    }
    router.replace("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-mono text-xs tracking-[0.2em] text-tape uppercase mb-2">Staff entry</p>
          <h1 className="font-display text-3xl font-600 text-ink">The Measurement Book</h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-card border border-line rounded-sm p-6 shadow-[0_1px_0_rgba(40,34,28,0.08)]"
        >
          <label className="block mb-4">
            <span className="block font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft mb-1">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line bg-white/60 rounded-sm px-3 py-2 text-ink font-body focus:outline-none focus:border-tape"
              placeholder="you@shop.com"
            />
          </label>

          <label className="block mb-6">
            <span className="block font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft mb-1">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line bg-white/60 rounded-sm px-3 py-2 text-ink font-body focus:outline-none focus:border-tape"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="text-tape-dark text-sm mb-4" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-card font-body font-500 rounded-sm py-2.5 hover:bg-tape-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-ink-soft text-xs mt-6 font-mono">
          Staff accounts are added by the shop owner in Supabase.
        </p>
      </div>
    </div>
  );
}
