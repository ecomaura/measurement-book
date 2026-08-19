"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabase";

type Client = {
  id: string;
  name: string;
  contact: string | null;
  created_at: string;
};

function HomeInner() {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [saving, setSaving] = useState(false);

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

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("clients")
      .insert({ name: newName.trim(), contact: newContact.trim() || null });
    setSaving(false);
    if (!error) {
      setNewName("");
      setNewContact("");
      setShowAdd(false);
      loadClients();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function handleExportBackup() {
    const [clientsRes, measurementsRes] = await Promise.all([
      supabase.from("clients").select("*").eq("is_deleted", false),
      supabase.from("measurements").select("*").eq("is_deleted", false),
    ]);
    const payload = {
      exported_at: new Date().toISOString(),
      clients: clientsRes.data ?? [],
      measurements: measurementsRes.data ?? [],
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `measurement-book-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
      <header className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-tape uppercase mb-1">Ledger</p>
          <h1 className="font-display text-3xl sm:text-4xl font-600 text-ink leading-none">
            The Measurement Book
          </h1>
        </div>
        <div className="flex flex-col items-end gap-1 mt-2">
          <button
            onClick={handleExportBackup}
            className="font-mono text-xs text-thread hover:text-tape-dark underline underline-offset-4"
          >
            export backup
          </button>
          <button
            onClick={handleLogout}
            className="font-mono text-xs text-ink-soft hover:text-tape-dark underline underline-offset-4"
          >
            sign out
          </button>
        </div>
      </header>

      <div className="flex gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a client by name…"
          className="flex-1 border border-line bg-card rounded-sm px-4 py-3 text-ink font-body focus:outline-none focus:border-tape"
        />
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="bg-ink text-card font-body font-500 rounded-sm px-4 py-3 hover:bg-tape-dark transition-colors whitespace-nowrap"
        >
          + New client
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAddClient}
          className="bg-card border border-line rounded-sm p-5 mb-6 torn-edge"
        >
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <label className="block">
              <span className="block font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft mb-1">
                Client name
              </span>
              <input
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-line bg-white/60 rounded-sm px-3 py-2 focus:outline-none focus:border-tape"
              />
            </label>
            <label className="block">
              <span className="block font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft mb-1">
                Contact no.
              </span>
              <input
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                className="w-full border border-line bg-white/60 rounded-sm px-3 py-2 focus:outline-none focus:border-tape"
              />
            </label>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 font-mono text-sm text-ink-soft"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-tape text-card font-body font-500 rounded-sm px-4 py-2 hover:bg-tape-dark transition-colors disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save client"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="font-mono text-sm text-ink-soft">turning pages…</p>
      ) : clients.length === 0 ? (
        <p className="font-mono text-sm text-ink-soft">
          {query ? "No client matches that name yet." : "No clients yet — add the first one above."}
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

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeInner />
    </AuthGuard>
  );
}
