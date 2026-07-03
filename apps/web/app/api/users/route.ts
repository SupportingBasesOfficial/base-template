import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@repo/supabase/server";
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
const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(1, "Nome é obrigatório").max(100),
  metadata: z.record(z.unknown()).optional(),
});

// Schema de resposta
const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  created_at: z.string(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("users").select("*").limit(50);

    if (error) {
      logger.error({ err: error }, "Erro ao buscar usuários");
      return NextResponse.json(
        { error: "Erro ao buscar usuários" },
        { status: 500 },
      );
    }

    return NextResponse.json({ users: data });
  } catch (err) {
    logger.error({ err }, "Erro inesperado em GET /api/users");
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = createUserSchema.safeParse(body);

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
      .from("users")
      .insert({
        email: input.data.email,
        name: input.data.name,
        metadata: input.data.metadata,
      } as never)
      .select()
      .single();

    if (error) {
      logger.error({ err: error }, "Erro ao criar usuário");
      return NextResponse.json(
        { error: "Erro ao criar usuário" },
        { status: 500 },
      );
    }

    const validated = userResponseSchema.parse(data);
    return NextResponse.json({ user: validated }, { status: 201 });
  } catch (err) {
    logger.error({ err }, "Erro inesperado em POST /api/users");
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
