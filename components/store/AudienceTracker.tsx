"use client";

import { useEffect } from "react";

interface AudienceTrackerProps {
  boutiqueId: string;
  produitId?: string;
}

export default function AudienceTracker({
  boutiqueId,
  produitId,
}: AudienceTrackerProps) {
  useEffect(() => {
    void fetch("/api/visites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boutiqueId, produitId }),
      keepalive: true,
    });
  }, [boutiqueId, produitId]);

  return null;
}
