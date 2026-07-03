"use client";

import { useEffect, useState } from "react";
import { createClient } from "@repo/supabase/client";

/**
 * Exemplo de subscription em tempo real com Supabase Realtime.
 *
 * Escuta mudanças na tabela 'users' e atualiza a UI em tempo real.
 *
 * Substitua a tabela e campos pelos seus.
 */
export function RealtimeUsersExample() {
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const supabase = createClient();

    // Carrega dados iniciais
    supabase
      .from("users")
      .select("id, name")
      .then(({ data }) => {
        if (data) setUsers(data);
      });

    // Subscribe para mudanças em tempo real
    const channel = supabase
      .channel("users-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setUsers((prev) => [...prev, payload.new as never]);
          }
          if (payload.eventType === "DELETE") {
            setUsers((prev) =>
              prev.filter((u) => u.id !== (payload.old as { id: string }).id),
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
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
