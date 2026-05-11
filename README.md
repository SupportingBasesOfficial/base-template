# Base Template Universal

> Monorepo Turborepo + Next.js 16 + Supabase + TypeScript.  
> Do vendedor de brigadeiro ao sistema da NASA — mesma fundação.

---

## Stack

| Camada | Tecnologia | Papel |
|--------|-----------|-------|
| **Build** | Turborepo | Orquestração de monorepo |
| **App** | Next.js 16.2 | Framework React (App Router) |
| **UI** | shadcn/ui + Tailwind v4 | Design system (Radix primitives) |
| **Data** | Supabase | PostgreSQL + Auth + Storage + Realtime |
| **Types** | TypeScript 5.9 | Tipagem end-to-end com tipos gerados do banco |
| **Test** | Vitest | Test runner com cobertura V8 |
| **DX** | Husky + lint-staged | Pre-commit guards |
| **CI** | GitHub Actions | lint → types → build → test |

---

## Protocolo de Boot

```powershell
# 1. Clone e instale
git clone <repo-url> && cd base-template
pnpm install

# 2. Suba o Supabase local (requer Docker)
npx supabase start

# 3. Configure variáveis de ambiente
cp apps/web/env.example apps/web/.env.local
# Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Aplique migrations e sincronize tipos
npx supabase db reset
.\sync-db.ps1

# 5. Desenvolva
pnpm dev          # http://localhost:3000
```

---

## Estrutura do Projeto

```
base-template/
├── apps/
│   └── web/                        # Next.js App Router
│       ├── app/
│       │   ├── api/health/         # Health check endpoint
│       │   └── page.tsx            # Landing page
│       ├── env.ts                  # Validação de env (build-time)
│       ├── middleware.ts           # Auth session refresh
│       └── postcss.config.mjs      # Tailwind v4
│
├── packages/
│   ├── supabase/                   # @repo/supabase
│   │   └── src/
│   │       ├── client.ts           # createClient() — browser
│   │       ├── server.ts           # createClient() — server
│   │       ├── middleware.ts       # updateSession()
│   │       └── types.ts            # Result<T>, ok(), err(), Database
│   ├── ui/                         # @repo/ui (shadcn/Radix primitives)
│   │   └── src/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── lib/utils.ts        # cn() utility
│   ├── tailwind-config/            # @repo/tailwind-config (preset)
│   ├── typescript-config/          # TS configs + database.types.ts
│   └── eslint-config/              # ESLint configs
│
├── supabase/
│   ├── migrations/                 # Migrations versionadas
│   └── SCHEMA.md                   # Documentação do banco
│
├── .github/workflows/ci.yml        # CI pipeline
├── vitest.config.ts                # Config global de testes
├── sync-db.ps1                     # Sync de tipos
└── docs/ARCHITECTURE.md            # Guias de escala (MEGA-TECH)
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
  const { data, error } = await supabase.from("users").select().eq("id", id).single();
  if (error) return err(error.message, error.code);
  return ok(data);
}
```

### `@repo/ui`

Componentes primitivos (Button, Card, Input). Seguem o padrão shadcn/ui.

```typescript
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";
```

### `@repo/tailwind-config`

Preset compartilhado. Cada app importa e pode sobrescrever tokens.

---

## Fluxo de Desenvolvimento

### Criar uma tabela

```powershell
# 1. Gerar migration
npx supabase migration new create_minha_tabela

# 2. Editar (seguir protocolo do SCHEMA.md)
# 3. Aplicar
npx supabase db reset

# 4. Sync tipos
.\sync-db.ps1

# 5. Atualizar SCHEMA.md
```

### Adicionar componente UI

```powershell
# Adicione em packages/ui/src/novo-componente.tsx
# Exporte em packages/ui/package.json (exports)
# Use no app: import { Comp } from "@repo/ui/novo-componente"
```

---

## Scripts

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Dev server (todos os apps) |
| `pnpm build` | Build de produção |
| `pnpm lint` | ESLint em todo o monorepo |
| `pnpm check-types` | Type-check em todos os packages |
| `pnpm test` | Vitest em modo watch |
| `pnpm test:run` | Vitest single run (CI) |
| `pnpm format` | Prettier em tudo |
| `.\sync-db.ps1` | Gera tipos TypeScript do banco |
| `npx supabase start` | Sobe Supabase local |
| `npx supabase db reset` | Reset + aplica migrations |

---

## Princípios

1. **YAGNI** — Se não serve ao brigadeiro E à NASA no dia 1, não entra no código.
2. **Migrations** — Zero SQL manual. Toda mudança via `supabase/migrations/`.
3. **RLS** — Toda tabela com Row Level Security. Sem exceção.
4. **Tipos** — `database.types.ts` é a fonte de verdade. `any` é proibido.
5. **Packages** — Código compartilhado vive em `packages/`, nunca duplicado em `apps/`.
6. **Env seguro** — Variáveis validadas no build. Se faltar, o app não sobe.

---

## Documentação Complementar

- [`supabase/SCHEMA.md`](./supabase/SCHEMA.md) — Banco de dados e protocolo de tabelas
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — Guias de escala para projetos MEGA-TECH
- [`apps/web/env.example`](./apps/web/env.example) — Variáveis de ambiente necessárias
