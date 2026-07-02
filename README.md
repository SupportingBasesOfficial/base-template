# Base Template Universal

> Monorepo Turborepo + Next.js 15 + Supabase + TypeScript.
> 100% Cloud Workflow. Zero local dev.
> Do vendedor de brigadeiro ao sistema da NASA — mesma fundação.

---

## Stack

| Camada     | Tecnologia              | Papel                                         |
| ---------- | ----------------------- | --------------------------------------------- |
| **Build**  | Turborepo               | Orquestração de monorepo                      |
| **App**    | Next.js 15              | Framework React (App Router)                  |
| **UI**     | Tailwind v3 + shadcn/ui | Design system (Button, Card, cn)              |
| **Data**   | Supabase Cloud          | PostgreSQL + Auth + Storage + Realtime        |
| **Types**  | TypeScript 5.9          | Tipagem end-to-end com tipos gerados do banco |
| **Test**   | Vitest                  | Test runner com cobertura V8                  |
| **DX**     | Husky + lint-staged     | Pre-commit guards                             |
| **CI**     | GitHub Actions          | lint → audit → types → build → test           |
| **Deploy** | Vercel                  | Auto-deploy on push + preview URLs            |
| **Dev**    | GitHub Codespaces       | Dev container na nuvem, sem Docker local      |

---

## Protocolo de Boot (100% Cloud)

```bash
# 1. Clone ou abra no GitHub Codespaces
#    Botão "Code" > "Codespaces" > "Create codespace on main"
#    O devcontainer instala Node 22, pnpm, Supabase CLI e Vercel CLI automaticamente

# 2. Instale dependências (auto no postCreateCommand)
pnpm install

# 3. Configure variáveis de ambiente
#    No GitHub: Settings > Codespaces > Secrets
#    OU copie .env.example para .env e preencha:
cp apps/web/.env.example apps/web/.env
#    NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_PROJECT_REF

# 4. Aplique migrations ao Supabase Cloud
npx supabase db push

# 5. Sincronize tipos TypeScript do banco cloud
pnpm sync-db

# 6. Rode o dev server (dentro do Codespace)
pnpm dev          # Codespaces faz port forwarding automatico
```

---

## Estrutura do Projeto

```
base-template/
├── .devcontainer/              # GitHub Codespaces config
│   ├── devcontainer.json       # Extensions, settings, ports
│   └── Dockerfile              # Supabase CLI + Vercel CLI
├── .github/
│   ├── workflows/ci.yml        # CI pipeline
│   └── dependabot.yml          # Dependency monitoring
├── apps/
│   └── web/                    # Next.js App Router
│       ├── app/
│       │   ├── api/health/     # Health check endpoint
│       │   ├── auth/callback/  # OAuth callback (code → session)
│       │   ├── error.tsx       # Error boundary global
│       │   ├── layout.tsx      # Root layout
│       │   ├── loading.tsx     # Loading UI (streaming fallback)
│       │   ├── not-found.tsx   # Página 404 customizada
│       │   └── page.tsx        # Landing page (auth-aware Server Component)
│       ├── env.ts              # Validação de env (build-time)
│       ├── middleware.ts       # Auth session refresh
│       └── package.json        # Dependencies
├── packages/
│   ├── supabase/               # @repo/supabase (client factories)
│   ├── ui/                     # @repo/ui (Button, Card, cn)
│   ├── tailwind-config/        # @repo/tailwind-config (globals.css)
│   ├── typescript-config/      # @repo/typescript-config (tsconfigs)
│   └── eslint-config/          # @repo/eslint-config (flat config + SAST)
├── supabase/
│   ├── migrations/             # Migrations versionadas
│   ├── config.toml             # Config cloud (sem Docker local)
│   └── SCHEMA.md               # Documentação do banco
├── docs/ARCHITECTURE.md        # Guias de escala (MEGA-TECH)
├── LICENSE                     # MIT License
├── sync-db.mjs                 # Sync tipos via Supabase Cloud
├── vercel.json                 # Deploy config
├── turbo.json                  # Orquestração de tasks
├── vitest.config.ts            # Config global de testes
├── .vscode/extensions.json     # Recomendações de extensions
├── .nvmrc                      # Node version (22)
└── .npmrc                      # Config pnpm (auto-install-peers)
```

---

## Packages

### `@repo/supabase`

Client factories tipadas. Nunca importe `@supabase/ssr` diretamente nos apps.

```typescript
// Client Component
import { createClient } from "@repo/supabase/client";
const supabase = createClient();

// Server Component / Route Handler
import { createClient } from "@repo/supabase/server";
const supabase = await createClient();

// Result Pattern — sem undefined inesperado
import { ok, err, type Result } from "@repo/supabase/types";
async function getUser(id: string): Promise<Result<User>> {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single();
  if (error) return err(error.message, error.code);
  return ok(data);
}
```

### `@repo/ui`

Componentes primitivos shadcn/ui (new-york style) + utilitário `cn()`.

Componentes inclusos: **Button** (6 variants × 4 sizes, suporte `asChild`), **Card** (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter).

CSS variables HSL (neutral base) em `@repo/tailwind-config/globals.css` com suporte light/dark.

```typescript
import { cn } from "@repo/ui/lib/utils";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";

// Adicionar mais componentes via shadcn CLI:
// npx shadcn@latest add input dialog label
```

---

## Fluxo de Desenvolvimento (Cloud)

### Auth SSR (Supabase)

O template inclui o loop completo de autenticação SSR:

1. **Middleware** (`middleware.ts`) — atualiza sessão em toda request via `@repo/supabase/middleware`
2. **Server Components** — chamam `createClient()` de `@repo/supabase/server` para ler a sessão
3. **OAuth Callback** (`/auth/callback`) — troca `code` por sessão e redireciona
4. **Landing page** — demo auth-aware: mostra email se logado, mensagem se não logado

Para habilitar OAuth (Google, GitHub, etc):

```bash
# Supabase Dashboard → Authentication → Providers
# Ative o provider desejado e configure:
#   Redirect URL: {APP_URL}/auth/callback
```

### Criar uma tabela

```bash
# 1. Gerar migration
npx supabase migration new create_minha_tabela

# 2. Editar (seguir protocolo do SCHEMA.md)

# 3. Aplicar ao Supabase Cloud
npx supabase db push

# 4. Sync tipos TypeScript
pnpm sync-db

# 5. Atualizar SCHEMA.md
```

### Deploy

```bash
# Automático: push para main deploy para produção na Vercel
# Preview: PRs geram preview URLs automaticamente

# Manual (se necessário):
vercel --prod
```

---

## Scripts

| Script                 | Descrição                                       |
| ---------------------- | ----------------------------------------------- |
| `pnpm dev`             | Dev server (dentro do Codespace)                |
| `pnpm build`           | Build de produção                               |
| `pnpm lint`            | ESLint + SAST em todo o monorepo                |
| `pnpm check-types`     | Type-check em todos os packages                 |
| `pnpm test`            | Vitest em modo watch                            |
| `pnpm test:run`        | Vitest single run (CI)                          |
| `pnpm format`          | Prettier em tudo                                |
| `pnpm clean`           | Remove node_modules e builds de todo o monorepo |
| `pnpm sync-db`         | Gera tipos TypeScript do banco Cloud            |
| `npx supabase db push` | Aplica migrations ao Supabase Cloud             |

---

## Princípios

1. **YAGNI** — Se não serve ao brigadeiro E à NASA no dia 1, não entra no código.
2. **100% Cloud** — Sem Docker local. Sem supabase start. Tudo via cloud.
3. **Migrations** — Zero SQL manual. Toda mudança via `supabase/migrations/`.
4. **RLS** — Toda tabela com Row Level Security. Sem exceção.
5. **Tipos** — `database.types.ts` é a fonte de verdade. `any` é proibido.
6. **Packages** — Código compartilhado vive em `packages/`, nunca duplicado em `apps/`.
7. **Env seguro** — Variáveis validadas no build. Se faltar, o app não sobe.

---

## Documentação Complementar

- [`SETUP.md`](./SETUP.md) — Protocolo de instanciação de novos projetos
- [`supabase/SCHEMA.md`](./supabase/SCHEMA.md) — Banco de dados e protocolo de tabelas
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — Guias de escala para projetos MEGA-TECH
- [`apps/web/.env.example`](./apps/web/.env.example) — Variáveis de ambiente necessárias

---

## FAQ

### Tipos Desatualizados do Supabase?

```bash
pnpm sync-db    # Sincroniza do Supabase Cloud
```

Certifique-se que `SUPABASE_PROJECT_REF` está definido no `.env`.

### Build falhando no CI?

Verifique se todas as envs do `env.ts` estão presentes nas variáveis do GitHub/Vercel. O t3-env trava o build se faltar algo.

### Como abrir no Codespaces?

GitHub > Repo > "Code" > "Codespaces" > "Create codespace on main". O `.devcontainer` configura tudo automaticamente.
