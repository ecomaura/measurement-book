"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabase";
import { fieldsFor, MeasurementType, TYPE_LABEL } from "@/lib/fields";

type RecordWithClient = {
  id: string;
  type: MeasurementType;
  fields: Record<string, string>;
  client_name: string;
};

function PrintInner() {
  const params = useParams<{ recordId: string }>();
  const [record, setRecord] = useState<RecordWithClient | null>(null);
  const [width, setWidth] = useState<"58" | "80">("80");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("measurements")
        .select("id,type,fields,clients(name)")
        .eq("id", params.recordId)
        .single();
      if (data) {
        setRecord({
          id: data.id,
          type: data.type,
          fields: data.fields,
          // @ts-expect-error supabase nested select typing
          client_name: data.clients?.name ?? "",
        });
      }
    }
    load();
  }, [params.recordId]);

  useEffect(() => {
    document.documentElement.style.setProperty("--receipt-width", `${width}mm`);
  }, [width]);

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-ink-soft">fetching the slip…</p>
      </div>
    );
  }

  const fields = fieldsFor(record.type).filter((f) => record.fields[f.key]?.trim());

  return (
    <div className="max-w-md mx-auto px-5 py-8">
      {/* Controls — hidden on the printed slip itself */}
      <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
        <span className="font-mono text-xs text-ink-soft uppercase tracking-wide">Roll width</span>
        <div className="flex border border-line rounded-sm overflow-hidden">
          {(["58", "80"] as const).map((w) => (
            <button
              key={w}
              onClick={() => setWidth(w)}
              className={`px-3 py-1.5 font-mono text-xs ${
                width === w ? "bg-ink text-card" : "bg-card text-ink-soft"
              }`}
            >
              {w}mm
            </button>
          ))}
        </div>
        <button
          onClick={() => window.print()}
          className="ml-auto bg-tape text-card font-body font-500 rounded-sm px-5 py-2 hover:bg-tape-dark transition-colors"
        >
          Print
        </button>
      </div>

      {/* The actual printable slip — only this is visible when printing */}
      <div
        id="print-slip"
        className="bg-card border border-line rounded-sm p-5 font-mono text-ink"
      >
        <p className="text-center font-body font-600 text-base mb-1">{record.client_name}</p>
        <p className="text-center text-xs uppercase tracking-widest mb-4">
          {TYPE_LABEL[record.type]}
        </p>
        <div className="border-t border-dashed border-ink/30 mb-3" />
        <div className="space-y-2">
          {fields.map((f) => (
            <div key={f.key} className="leading-tight">
              <div className="text-[0.7rem] uppercase tracking-wide opacity-70">{f.label}</div>
              <div className="text-sm font-600">{record.fields[f.key]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PrintPage() {
  return (
    <AuthGuard>
      <PrintInner />
    </AuthGuard>
  );
}
