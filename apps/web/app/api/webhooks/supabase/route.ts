import { NextResponse } from "next/server";
import { logger } from "@repo/logger";

/**
 * Webhook handler — recebe webhooks do Supabase (database changes).
 *
 * Configure no Supabase Dashboard > Database > Webhooks.
 *
 * Segurança:
 * - Valida o token de autorização (configure no Supabase)
 * - Usa service role key para operações privilegiadas
 *
 * Substitua a lógica pela sua implementação.
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    // Validação do token do webhook (configure no Supabase Dashboard)
    if (authHeader !== `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`) {
      logger.warn("Webhook com token inválido");
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const payload = await request.json();

    logger.info(
      {
        table: payload.table,
        type: payload.type,
        record_id: payload.record?.id,
      },
      "Webhook recebido do Supabase",
    );

    // Exemplo: processar mudança
    if (payload.type === "INSERT" && payload.table === "profiles") {
      // Exemplo: enviar email de boas-vindas
      logger.info(
        { full_name: payload.record.full_name },
        "Novo perfil criado — enviar email de boas-vindas",
      );
    }

    if (payload.type === "DELETE" && payload.table === "profiles") {
      // Exemplo: limpar dados relacionados
      logger.info(
        { id: payload.old_record?.id },
        "Perfil deletado — limpar dados relacionados",
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error({ err }, "Erro ao processar webhook");
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
