import { updateSession } from "@repo/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware do Next.js.
 *
 * 1. Mantém a sessão do Supabase sincronizada no SSR
 * 2. Protege rotas autenticadas (redireciona para / se não logado)
 * 3. Permite acesso a rotas públicas sem auth
 *
 * DELETÁVEL: Se você não usar Supabase, pode deletar este arquivo.
 */

const publicRoutes = ["/", "/auth/callback"];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  // Verifica se a rota é protegida
  const { pathname } = request.nextUrl;
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isPublicRoute) {
    return response;
  }

  // Redireciona para home se não estiver autenticado
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
