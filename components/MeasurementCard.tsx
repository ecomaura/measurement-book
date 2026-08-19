"use client";

import Link from "next/link";
import { fieldsFor, MeasurementType } from "@/lib/fields";

export type MeasurementRecord = {
  id: string;
  type: MeasurementType;
  measured_on: string;
  fields: Record<string, string>;
  created_at: string;
};

type Props = {
  record: MeasurementRecord;
  isLatest: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function MeasurementCard({ record, isLatest, onEdit, onDelete }: Props) {
  const fields = fieldsFor(record.type);
  const filled = fields.filter((f) => record.fields[f.key]?.trim());

  return (
    <div className="bg-card border border-line rounded-sm p-5 torn-edge relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-ink-soft">
            {new Date(record.measured_on + "T00:00:00").toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          {isLatest && (
            <span className="bg-tape text-card font-mono text-[0.65rem] uppercase tracking-wide px-2 py-0.5 rounded-sm">
              Latest
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            href={`/print/${record.id}`}
            className="font-mono text-xs text-thread hover:text-tape-dark underline underline-offset-4"
          >
            print
          </Link>
          <button
            onClick={onEdit}
            className="font-mono text-xs text-ink-soft hover:text-tape-dark underline underline-offset-4"
          >
            edit
          </button>
          <button
            onClick={onDelete}
            className="font-mono text-xs text-ink-soft hover:text-tape-dark underline underline-offset-4"
          >
            delete
          </button>
        </div>
      </div>

      {filled.length === 0 ? (
        <p className="font-mono text-sm text-ink-soft">No fields filled in.</p>
      ) : (
        <div className="space-y-1.5">
          {filled.map((f) => (
            <div key={f.key} className="leader-row">
              <span className="leader-label">{f.label}</span>
              <span className="leader-fill" />
              <span className="leader-value">{record.fields[f.key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
