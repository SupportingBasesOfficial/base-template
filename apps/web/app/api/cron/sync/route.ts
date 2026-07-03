import { NextResponse } from "next/server";
import { logger } from "@repo/logger";

/**
 * Cron job route — executa tarefas agendadas.
 *
 * Configure no vercel.json:
 *   "crons": [{ "path": "/api/cron/sync", "schedule": "0 2 * * *" }]
 *
 * Segurança:
 * - Valida CRON_SECRET para impedir acesso não autorizado
 * - Só executa se a rota for chamada pelo cron da Vercel
 *
 * Substitua a lógica pela sua implementação.
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    logger.info("Cron job iniciado: sync");

    // Exemplo: sincronizar dados ou executar manutenção
    // import { createClient } from "@repo/supabase/server";
    // const supabase = await createClient();
    // const { error } = await supabase.rpc("cleanup_expired_sessions");
    // if (error) throw error;

    logger.info("Cron job concluído: sync");
    return NextResponse.json({
      ok: true,
      executedAt: new Date().toISOString(),
    });
  } catch (err) {
    logger.error({ err }, "Erro no cron job: sync");
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
