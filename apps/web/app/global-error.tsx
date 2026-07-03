"use client";

import { useEffect } from "react";
import { logger } from "@repo/logger";

/**
 * global-error.tsx — Root error boundary do Next.js App Router.
 *
 * Diferente de error.tsx, este captura erros que acontecem
 * no próprio root layout (acima dele). Por isso, deve ter
 * <html> e <body> próprios.
 *
 * Sem isso, erros no root layout causam tela branca.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(
      { err: error, digest: error.digest },
      "Global error boundary capturou erro no root layout",
    );
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          padding: "2rem",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Erro crítico
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#a1a1aa",
              marginBottom: "1rem",
            }}
          >
            Ocorreu um erro inesperado no nível raiz da aplicação.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid #3f3f46",
              backgroundColor: "transparent",
              color: "#fafafa",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
