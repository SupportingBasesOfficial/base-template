# Base Template Universal

> Monorepo Turborepo + Next.js 15 + Supabase + TypeScript.
> 100% Cloud Workflow. Zero local dev.
> Do vendedor de brigadeiro ao sistema da NASA — mesma fundação.

[![CI](https://github.com/SupportingBasesOfficial/base-template/actions/workflows/ci.yml/badge.svg)](https://github.com/SupportingBasesOfficial/base-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-22-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9-orange.svg)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-green.svg)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

---

## Stack

| Camada         | Tecnologia                       | Papel                                         |
| -------------- | -------------------------------- | --------------------------------------------- |
| **Build**      | Turborepo                        | Orquestração de monorepo com cache            |
| **App**        | Next.js 15 (App Router)          | Framework React com Server Components         |
| **UI**         | Tailwind v3 + shadcn/ui          | Design system (Button, Card, Dropdown, etc.)  |
| **Data**       | Supabase Cloud                   | PostgreSQL + Auth + Storage + Realtime        |
| **Types**      | TypeScript 5.9                   | Tipagem end-to-end com tipos gerados do banco |
| **Test**       | Vitest + Playwright              | Unit/component tests + E2E                    |
| **Docs**       | Storybook 8                      | Component playground e documentação           |
| **DX**         | Husky + lint-staged + Commitlint | Pre-commit + pre-push guards                  |
| **CI**         | GitHub Actions                   | lint → audit → types → build → test com cache |
| **Deploy**     | Vercel                           | Auto-deploy + preview URLs + cron jobs        |
| **Dev**        | GitHub Codespaces                | Dev container na nuvem, sem Docker local      |
| **Monitoring** | Sentry + OpenTelemetry           | Error tracking + distributed tracing          |
| **Email**      | React Email                      | Templates tipados de email                    |
| **i18n**       | next-intl                        | Internacionalização pronta (pt-BR, en)        |
| **Versioning** | Changesets                       | Versionamento semântico de monorepo           |

---

## Features (60+)

### Core

- ✅ Next.js 15 App Router com Server Components
- ✅ Supabase Auth SSR (middleware + OAuth callback + session refresh)
- ✅ shadcn/ui components (Button, Card, Dropdown Menu, Toaster/Sonner)
- ✅ Dark mode com next-themes
- ✅ Tailwind CSS com tailwindcss-animate
- ✅ TypeScript 5.9 strict com tipos gerados do banco

### Quality & Testing

- ✅ Vitest com jsdom + testing-library/react
- ✅ Playwright para E2E
- ✅ Storybook 8 com Vite
- ✅ ESLint 9 flat config com SAST
- ✅ eslint-plugin-jsx-a11y (acessibilidade)
- ✅ Pre-commit (lint-staged) + Pre-push (test:run) hooks
- ✅ Commitlint com Conventional Commits
- ✅ API route test example

### Production-Ready

- ✅ Sentry error monitoring (client, server, edge)
- ✅ OpenTelemetry instrumentation (@vercel/otel)
- ✅ Web Vitals reporting (next/web-vitals)
- ✅ Structured logging com pino (@repo/logger)
- ✅ Rate limiting middleware example (Upstash Redis)
- ✅ API route com Zod validation (pattern type-safe)
- ✅ Auth middleware com proteção de rotas
- ✅ Supabase Realtime example
- ✅ Supabase Storage upload example
- ✅ Webhook handler pattern
- ✅ Cron job route com vercel.json
- ✅ CSP headers + security headers
- ✅ Env validation com @t3-oss/env-nextjs + Zod

### Developer Experience

- ✅ Plop-style generators (page, component, API route)
- ✅ CLI tool (create-base-template) para instantiation
- ✅ i18n setup com next-intl (pt-BR, en)
- ✅ Feature flags system
- ✅ Admin layout scaffold com sidebar
- ✅ React Email templates
- ✅ Bundle analyzer (@next/bundle-analyzer)
- ✅ Changesets para versionamento
- ✅ PWA manifest
- ✅ next/image optimization examples

### SEO

- ✅ robots.ts dinâmico
- ✅ sitemap.ts dinâmico
- ✅ OpenGraph + Twitter Cards metadata
- ✅ PWA manifest.json

### DevOps & Open Source

- ✅ GitHub Actions CI com Turbo cache + pnpm cache
- ✅ Lighthouse CI workflow
- ✅ Dependabot
- ✅ CODEOWNERS
- ✅ PR template + Issue templates (bug, feature)
- ✅ CONTRIBUTING.md
- ✅ SECURITY.md
- ✅ CODE_OF_CONDUCT.md
- ✅ CHANGELOG.md (Keep a Changelog)
- ✅ LICENSE (MIT)
- ✅ Dockerfile (multi-stage) + .dockerignore
- ✅ .nvmrc, .editorconfig, .prettierrc
- ✅ .env.example documentado

### Future-Proof

- ✅ React Compiler (condicional: `ENABLE_REACT_COMPILER=true`)
- ✅ Partial Prerendering (condicional: `ENABLE_PPR=true`)
- ✅ Multi-tenant architecture guide no ARCHITECTURE.md
- ✅ global-error.tsx (root error boundary)
- ✅ not-found.tsx (404 customizada)
- ✅ loading.tsx (skeleton states)

---

## Protocolo de Boot (100% Cloud)

```bash
# 1. Clone ou abra no GitHub Codespaces
#    Botão "Code" > "Codespaces" > "Create codespace on main"

# 2. Instale dependências (auto no postCreateCommand)
pnpm install

# 3. Configure variáveis de ambiente
cp .env.example .env
#    Preencha: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_PROJECT_REF

# 4. Aplique migrations ao Supabase Cloud
npx supabase db push

# 5. Sincronize tipos TypeScript do banco cloud
pnpm sync-db

# 6. Rode o dev server
pnpm dev
```

### Instanciação rápida via CLI

```bash
npx create-base-template my-app
```

---

## Estrutura do Projeto

```
base-template/
├── .changeset/                # Changesets para versionamento
├── .github/
│   ├── ISSUE_TEMPLATE/        # Bug report + Feature request
│   ├── workflows/
│   │   ├── ci.yml             # CI com Turbo cache
│   │   └── lighthouse.yml     # Lighthouse CI
│   ├── CODEOWNERS             # Reviewers automáticos
│   ├── dependabot.yml         # Dependency monitoring
│   ├── PULL_REQUEST_TEMPLATE.md
├── .husky/                    # Git hooks
│   ├── pre-commit             # lint-staged
│   ├── pre-push               # test:run
│   └── commit-msg             # commitlint
├── .storybook/                # Storybook config
├── apps/
│   ├── web/                   # Next.js App Router
│   │   ├── app/
│   │   │   ├── (admin)/       # Admin layout scaffold
│   │   │   ├── api/
│   │   │   │   ├── cron/      # Cron job route
│   │   │   │   ├── health/    # Health check
│   │   │   │   ├── users/     # Zod validation example
│   │   │   │   └── webhooks/  # Webhook handler
│   │   │   ├── auth/callback/ # OAuth callback
│   │   │   ├── examples/      # Realtime, Storage, Image
│   │   │   ├── global-error.tsx
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── not-found.tsx
│   │   │   ├── robots.ts
│   │   │   ├── sitemap.ts
│   │   │   └── web-vitals.tsx
│   │   ├── emails/            # React Email templates
│   │   ├── i18n/              # next-intl config
│   │   ├── messages/          # pt-BR.json, en.json
│   │   ├── lib/feature-flags.ts
│   │   ├── sentry.*.config.ts # Sentry (client/server/edge)
│   │   ├── instrumentation.ts # OpenTelemetry
│   │   ├── env.ts             # Env validation (t3-env)
│   │   └── middleware.ts      # Auth + route protection
│   └── docs/                  # Docs site (Next.js)
├── cli/                       # create-base-template CLI
├── packages/
│   ├── eslint-config/         # @repo/eslint-config (flat + jsx-a11y)
│   ├── logger/                # @repo/logger (pino)
│   ├── supabase/              # @repo/supabase (client factories)
│   ├── tailwind-config/       # @repo/tailwind-config
│   ├── typescript-config/     # @repo/typescript-config
│   └── ui/                    # @repo/ui (shadcn/ui)
├── scripts/                   # Generators (page, component, API)
├── supabase/
│   ├── migrations/            # SQL migrations versionadas
│   ├── seed.sql               # Seed script
│   ├── config.toml
│   └── SCHEMA.md              # Diagrama Mermaid do banco
├── docs/ARCHITECTURE.md       # Guias de escala + multi-tenant
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── SECURITY.md
├── Dockerfile                 # Multi-stage build
├── LICENSE                    # MIT
└── turbo.json
```

---

## Scripts

| Script                  | Descrição                                   |
| ----------------------- | ------------------------------------------- |
| `pnpm dev`              | Dev server                                  |
| `pnpm build`            | Build de produção                           |
| `pnpm lint`             | ESLint + SAST + jsx-a11y em todo o monorepo |
| `pnpm check-types`      | Type-check em todos os packages             |
| `pnpm test`             | Vitest em modo watch                        |
| `pnpm test:run`         | Vitest single run (CI)                      |
| `pnpm e2e`              | Playwright E2E tests                        |
| `pnpm storybook`        | Storybook dev server                        |
| `pnpm build-storybook`  | Storybook build estático                    |
| `pnpm analyze`          | Bundle analyzer                             |
| `pnpm format`           | Prettier em tudo                            |
| `pnpm clean`            | Remove node_modules e builds                |
| `pnpm sync-db`          | Gera tipos TypeScript do banco Cloud        |
| `pnpm changeset`        | Cria um changeset                           |
| `pnpm version-packages` | Aplica changesets (bump versions)           |
| `pnpm release`          | Versiona + publica packages                 |
| `pnpm gen:page`         | Gera nova página Next.js                    |
| `pnpm gen:component`    | Gera novo componente UI                     |
| `pnpm gen:api`          | Gera nova API route                         |

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

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — Como contribuir
- [`SECURITY.md`](./SECURITY.md) — Política de segurança
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) — Código de conduta
- [`CHANGELOG.md`](./CHANGELOG.md) — Histórico de versões
- [`supabase/SCHEMA.md`](./supabase/SCHEMA.md) — Banco de dados e diagrama Mermaid
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — Guias de escala + multi-tenant
- [`.env.example`](./.env.example) — Variáveis de ambiente necessárias

---

## License

MIT © [SupportingBases](https://github.com/SupportingBasesOfficial)
