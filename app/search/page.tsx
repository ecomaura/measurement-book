"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import NavBar from "@/components/NavBar";
import Logo from "@/components/Logo";
import { BRAND_NAME } from "@/lib/fields";
import { supabase } from "@/lib/supabase";

type Client = {
  id: string;
  name: string;
  contact: string | null;
  created_at: string;
};

function SearchInner() {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadClients() {
    setLoading(true);
    const req = supabase
      .from("clients")
      .select("id,name,contact,created_at")
      .eq("is_deleted", false)
      .order("name", { ascending: true });
    const { data } = query
      ? await req.ilike("name", `%${query}%`)
      : await req;
    setClients(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(loadClients, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
            <div className="flex flex-col items-center mb-6">
        <Logo size="lg" />
                <p className="font-garamond font-bold text-lg sm:text-xl uppercase text-center mt-2" style={{ color: "#311503" }}>{BRAND_NAME}</p>
      </div>

      <NavBar />

      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a client by name…"
        className="w-full border border-line bg-card rounded-sm px-4 py-3 text-ink font-body focus:outline-none focus:border-tape mb-6"
      />

      {loading ? (
        <p className="font-mono text-sm text-ink-soft">turning pages…</p>
      ) : clients.length === 0 ? (
        <p className="font-mono text-sm text-ink-soft">
          {query ? "No client matches that name yet." : "No clients yet."}
        </p>
      ) : (
        <ul className="space-y-2">
          {clients.map((c) => (
            <li key={c.id}>
              <Link
                href={`/clients/${c.id}`}
                className="flex items-center justify-between bg-card border border-line rounded-sm px-4 py-3 hover:border-tape transition-colors group"
              >
                <span className="font-body text-ink font-500">{c.name}</span>
                <span className="font-mono text-xs text-ink-soft group-hover:text-tape-dark">
                  open →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <AuthGuard>
      <SearchInner />
    </AuthGuard>
  );
}
