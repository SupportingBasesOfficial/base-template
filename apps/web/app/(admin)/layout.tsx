import Link from "next/link";

/**
 * Admin layout scaffold — estrutura base para dashboard admin.
 *
 * Route group (admin) com sidebar de navegação.
 * Crie rotas dentro de app/(admin)/ que herdam este layout.
 *
 * Protegido pelo middleware.ts (rotas não-públicas exigem auth).
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/30 p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Admin</h2>
        </div>
        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/users"
            className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Usuários
          </Link>
          <Link
            href="/dashboard/settings"
            className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Configurações
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
