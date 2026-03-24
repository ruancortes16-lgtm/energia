"use client";

import { useEffect, useState } from "react";

import { ReadingForm } from "@/components/ui/ReadingForm";
import { ReadingsTable } from "@/components/ui/ReadingsTable";
import { Topbar } from "@/components/ui/Topbar";
import { getReadings } from "@/lib/api";
import { Reading } from "@/types";

export default function ReadingsPage() {
  const [readings, setReadings] = useState<Reading[]>([]);

  async function loadReadings() {
    const data = await getReadings(160);
    setReadings(data);
  }

  useEffect(() => {
    loadReadings().catch(() => undefined);
  }, []);

  return (
    <main className="app-shell">
      <Topbar />
      <div className="page-grid">
        <ReadingForm onCreated={loadReadings} />
        <ReadingsTable readings={readings} />
      </div>
    </main>
  );
}
