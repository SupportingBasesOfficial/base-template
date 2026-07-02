import { createClient } from "@repo/supabase/server";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Base Template Universal</CardTitle>
          <CardDescription>
            Monorepo Turborepo + Next.js + Supabase + TypeScript
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <p className="text-sm text-muted-foreground">
              Conectado como{" "}
              <span className="font-medium text-foreground">{user.email}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum usuário autenticado. Substitua este conteúdo pela sua
              aplicação.
            </p>
          )}
          <Button asChild variant="outline" className="w-full">
            <a href="https://supabase.com/docs/guides/auth/server-side/nextjs">
              Documentação Auth SSR
            </a>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
