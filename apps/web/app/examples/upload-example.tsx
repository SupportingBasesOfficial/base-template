"use client";

import { useState } from "react";
import { createClient } from "@repo/supabase/client";

/**
 * Exemplo de upload de arquivo com Supabase Storage.
 *
 * Faz upload de um arquivo para o bucket 'uploads' e retorna a URL pública.
 *
 * Pré-requisitos:
 * 1. Crie um bucket 'uploads' no Supabase Dashboard > Storage
 * 2. Configure políticas RLS no bucket
 */
export function StorageUploadExample() {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();

    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    if (error) {
      console.error("Erro no upload:", error);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("uploads").getPublicUrl(fileName);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="text-sm"
      />
      {uploading && (
        <p className="text-sm text-muted-foreground">Enviando...</p>
      )}
      {url && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Upload concluído:</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            {url}
          </a>
        </div>
      )}
    </div>
  );
}
