"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareSection({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url = `${window.location.origin}/join?code=${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="rounded-lg p-6 text-center space-y-3"
      style={{ backgroundColor: "var(--theme-surface)" }}
    >
      <p
        className="text-sm font-medium"
        style={{ color: "var(--theme-muted-text)" }}
      >
        Share this room
      </p>
      <p className="text-3xl font-mono font-bold tracking-widest">{code}</p>
      <Button
        onClick={handleCopy}
        className="mt-2"
        style={{
          backgroundColor: "var(--theme-primary)",
          color: "var(--theme-bg)",
        }}
      >
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  );
}
