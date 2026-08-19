"use client";

import { useState } from "react";
import { fieldsFor, MeasurementType } from "@/lib/fields";

type Props = {
  type: MeasurementType;
  initialValues?: Record<string, string>;
  initialDate?: string;
  onCancel: () => void;
  onSave: (values: Record<string, string>, date: string) => Promise<void>;
  saveLabel?: string;
};

export default function MeasurementForm({
  type,
  initialValues,
  initialDate,
  onCancel,
  onSave,
  saveLabel = "Save measurement",
}: Props) {
  const fields = fieldsFor(type);
  const [values, setValues] = useState<Record<string, string>>(initialValues ?? {});
  const [date, setDate] = useState(initialDate ?? new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(values, date);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-line rounded-sm p-5 torn-edge">
      <label className="block mb-4 max-w-xs">
        <span className="block font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft mb-1">
          Date measured
        </span>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-line bg-white/60 rounded-sm px-3 py-2 font-mono focus:outline-none focus:border-tape"
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {fields.map((f) => (
          <label key={f.key} className={f.type === "textarea" ? "sm:col-span-2 block" : "block"}>
            <span className="block font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft mb-1">
              {f.label}
            </span>
            {f.type === "textarea" ? (
              <textarea
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                rows={2}
                className="w-full border border-line bg-white/60 rounded-sm px-3 py-2 focus:outline-none focus:border-tape"
              />
            ) : (
              <input
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                className="w-full border border-line bg-white/60 rounded-sm px-3 py-2 font-mono focus:outline-none focus:border-tape"
              />
            )}
          </label>
        ))}
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 font-mono text-sm text-ink-soft"
        >
          cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-tape text-card font-body font-500 rounded-sm px-5 py-2 hover:bg-tape-dark transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : saveLabel}
        </button>
      </div>
    </form>
  );
}
