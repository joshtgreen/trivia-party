"use client";

import { useState, useEffect } from "react";

interface TimerProps {
  /** Server-set deadline as a Unix timestamp (ms). */
  endsAt: number;
  /** Total duration in ms (for calculating progress). */
  totalMs?: number;
  /** Called when timer reaches zero. */
  onExpire?: () => void;
}

/**
 * Countdown timer synced to a server-authoritative `endsAt` timestamp.
 * Renders a circular progress ring + seconds remaining.
 */
export function Timer({ endsAt, totalMs = 20000, onExpire }: TimerProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= endsAt) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [endsAt, onExpire]);

  const remaining = Math.max(0, endsAt - now);
  const seconds = Math.ceil(remaining / 1000);
  const progress = remaining / totalMs;

  // SVG circle math
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - progress);

  const urgentClass = seconds <= 3 ? "text-red-400" : "text-white";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={96} height={96} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={48}
          cy={48}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          className="text-zinc-700"
        />
        {/* Progress ring */}
        <circle
          cx={48}
          cy={48}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className={`transition-all duration-100 ${urgentClass}`}
        />
      </svg>
      <span
        className={`absolute text-2xl font-bold font-mono tabular-nums ${urgentClass}`}
      >
        {seconds}
      </span>
    </div>
  );
}
