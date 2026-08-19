"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import MeasurementForm from "@/components/MeasurementForm";
import MeasurementCard, { MeasurementRecord } from "@/components/MeasurementCard";
import { supabase } from "@/lib/supabase";
import { MeasurementType, TYPE_LABEL } from "@/lib/fields";
import { whatsappLink } from "@/lib/whatsapp";

type Client = { id: string; name: string; contact: string | null };

function ClientDetailInner() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const clientId = params.id;

  const [client, setClient] = useState<Client | null>(null);
  const [tab, setTab] = useState<MeasurementType>("blouse");
  const [records, setRecords] = useState<MeasurementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [clientRes, recordsRes] = await Promise.all([
      supabase.from("clients").select("id,name,contact").eq("id", clientId).single(),
      supabase
        .from("measurements")
        .select("id,type,measured_on,fields,created_at")
        .eq("client_id", clientId)
        .eq("type", tab)
        .eq("is_deleted", false)
        .order("measured_on", { ascending: false })
        .order("created_at", { ascending: false }),
    ]);
    setClient(clientRes.data ?? null);
    setRecords((recordsRes.data as MeasurementRecord[]) ?? []);
    setLoading(false);
  }, [clientId, tab]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(values: Record<string, string>, date: string) {
    await supabase.from("measurements").insert({
      client_id: clientId,
      type: tab,
      measured_on: date,
      fields: values,
    });
    setShowAddForm(false);
    load();
  }

  async function handleEditSave(id: string, values: Record<string, string>, date: string) {
    await supabase
      .from("measurements")
      .update({ fields: values, measured_on: date })
      .eq("id", id);
    setEditingId(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this measurement record? This can't be undone from the app.")) return;
    await supabase.from("measurements").update({ is_deleted: true }).eq("id", id);
    load();
  }

  if (loading && !client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-ink-soft">turning pages…</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-ink-soft">Client not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
      <Link href="/" className="font-mono text-xs text-ink-soft hover:text-tape-dark">
        ← back to ledger
      </Link>

      <header className="mt-4 mb-6">
        <h1 className="font-display text-3xl font-600 text-ink">{client.name}</h1>
        {client.contact && (
          <div className="flex items-center gap-3 mt-1">
            <p className="font-mono text-sm text-ink-soft">{client.contact}</p>
            {whatsappLink(client.contact) && (
              <a
                href={whatsappLink(client.contact)!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-thread text-card font-mono text-xs uppercase tracking-wide rounded-sm px-2.5 py-1 hover:bg-tape-dark transition-colors"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.71.45 3.38 1.3 4.85L2.05 22l5.36-1.36a9.9 9.9 0 0 0 4.63 1.15h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.26.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.18.81.85-3.1-.2-.32a8.18 8.18 0 0 1-1.26-4.38c0-4.55 3.7-8.25 8.29-8.25M8.5 6.9c-.17 0-.44.06-.67.32-.23.25-.87.85-.87 2.08 0 1.22.89 2.4 1.02 2.57.12.16 1.75 2.8 4.31 3.83 2.13.86 2.57.69 3.03.65.46-.04 1.49-.6 1.7-1.19.21-.58.21-1.08.15-1.19-.06-.1-.23-.16-.48-.28-.25-.13-1.5-.74-1.73-.83-.23-.08-.4-.13-.57.13-.17.25-.65.83-.8 1-.15.16-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.41.08-.16.04-.31-.02-.44-.06-.13-.57-1.39-.79-1.9-.2-.5-.41-.42-.57-.43z" />
                </svg>
                WhatsApp
              </a>
            )}
          </div>
        )}
      </header>

      {/* Tabs */}
      <div className="flex border-b border-line mb-6">
        {(["blouse", "kurta"] as MeasurementType[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setShowAddForm(false);
              setEditingId(null);
            }}
            className={`font-body px-4 py-2.5 border-b-2 -mb-px transition-colors ${
              tab === t
                ? "border-tape text-tape-dark font-600"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-ink text-card font-body font-500 rounded-sm px-4 py-2.5 hover:bg-tape-dark transition-colors"
          >
            + Add new {TYPE_LABEL[tab].toLowerCase()} measurement
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <MeasurementForm
            type={tab}
            onCancel={() => setShowAddForm(false)}
            onSave={handleAdd}
            saveLabel="Save measurement"
          />
        </div>
      )}

      {loading ? (
        <p className="font-mono text-sm text-ink-soft">turning pages…</p>
      ) : records.length === 0 ? (
        <p className="font-mono text-sm text-ink-soft">
          No {TYPE_LABEL[tab].toLowerCase()} measurements recorded yet.
        </p>
      ) : (
        <div className="space-y-4">
          {records.map((r, i) =>
            editingId === r.id ? (
              <MeasurementForm
                key={r.id}
                type={r.type}
                initialValues={r.fields}
                initialDate={r.measured_on}
                onCancel={() => setEditingId(null)}
                onSave={(values, date) => handleEditSave(r.id, values, date)}
                saveLabel="Save changes"
              />
            ) : (
              <MeasurementCard
                key={r.id}
                record={r}
                isLatest={i === 0}
                onEdit={() => setEditingId(r.id)}
                onDelete={() => handleDelete(r.id)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function ClientDetailPage() {
  return (
    <AuthGuard>
      <ClientDetailInner />
    </AuthGuard>
  );
}
