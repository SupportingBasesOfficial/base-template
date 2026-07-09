import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@repo/supabase/server";
import type { Json } from "@repo/supabase";
import { logger } from "@repo/logger";

/**
 * API route com Zod validation — pattern type-safe.
 *
 * Este é um exemplo de como estruturar API routes com:
 * - Validação de input com Zod
 * - Tipagem end-to-end (input -> query -> response)
 * - Error handling estruturado
 * - Logger integrado
 *
 * Substitua a lógica de negócio pela sua implementação.
 */

// Schema de validação do input
const createProfileSchema = z.object({
  user_id: z.string().uuid("user_id inválido"),
  full_name: z.string().min(1, "Nome é obrigatório").max(100).optional(),
  avatar_url: z.string().url("URL do avatar inválida").optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Schema de resposta
const profileResponseSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  created_at: z.string(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(50);

    if (error) {
      logger.error({ err: error }, "Erro ao buscar perfis");
      return NextResponse.json(
        { error: "Erro ao buscar perfis" },
        { status: 500 },
      );
    }

    return NextResponse.json({ profiles: data });
  } catch (err) {
    logger.error({ err }, "Erro inesperado em GET /api/profiles");
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = createProfileSchema.safeParse(body);

    if (!input.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: input.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        user_id: input.data.user_id,
        full_name: input.data.full_name,
        avatar_url: input.data.avatar_url,
        metadata: input.data.metadata as Json,
      })
      .select()
      .single();

    if (error) {
      logger.error({ err: error }, "Erro ao criar perfil");
      return NextResponse.json(
        { error: "Erro ao criar perfil" },
        { status: 500 },
      );
    }

    const validated = profileResponseSchema.parse(data);
    return NextResponse.json({ profile: validated }, { status: 201 });
  } catch (err) {
    logger.error({ err }, "Erro inesperado em POST /api/profiles");
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
