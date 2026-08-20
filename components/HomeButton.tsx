"use client";

import Link from "next/link";

export default function HomeButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft border border-line rounded-sm px-3 py-1.5 bg-card hover:border-tape hover:text-tape-dark transition-colors print:hidden"
    >
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 10v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Home
    </Link>
  );
}
