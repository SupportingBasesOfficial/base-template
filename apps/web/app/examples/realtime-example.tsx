"use client";

import { useEffect, useState } from "react";
import { createClient } from "@repo/supabase/client";

/**
 * Exemplo de subscription em tempo real com Supabase Realtime.
 *
 * Escuta mudanças na tabela 'profiles' e atualiza a UI em tempo real.
 *
 * Substitua a tabela e campos pelos seus.
 */
export function RealtimeProfilesExample() {
  const [profiles, setProfiles] = useState<
    Array<{ id: string; full_name: string | null }>
  >([]);

  useEffect(() => {
    const supabase = createClient();

    // Carrega dados iniciais
    supabase
      .from("profiles")
      .select("id, full_name")
      .then(({ data }) => {
        if (data) setProfiles(data);
      });

    // Subscribe para mudanças em tempo real
    const channel = supabase
      .channel("profiles-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setProfiles((prev) => [...prev, payload.new as never]);
          }
          if (payload.eventType === "DELETE") {
            setProfiles((prev) =>
              prev.filter((p) => p.id !== (payload.old as { id: string }).id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ul>
      {profiles.map((profile) => (
        <li key={profile.id}>{profile.full_name ?? "Sem nome"}</li>
      ))}
    </ul>
  );
}
