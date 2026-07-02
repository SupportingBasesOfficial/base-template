# Changelog

Todos os cambios notáveis neste projeto serão documentados neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/spec/v2.0.0.html).

## [Unreleased]

### Added

- Testing Library + jsdom no Vitest para testes de componentes React
- 6 componentes shadcn/ui: Input, Label, Dialog, DropdownMenu, Skeleton, Sonner
- Dark mode toggle com next-themes (ThemeProvider + ThemeToggle)
- Playwright E2E (config + 2 testes: landing page e 404)
- Storybook com stories para Button e Card
- Conventional Commits com commitlint + hook husky
- PR template + Issue templates (bug report e feature request)
- CONTRIBUTING.md com guia completo de contribuição
- Bundle analyzer com @next/bundle-analyzer (`pnpm analyze`)
- Seed script Supabase (`supabase/seed.sql`)
- Lighthouse CI no GitHub Actions
- Content Security Policy (CSP) no next.config.mjs
- Plop generators: `pnpm gen:page`, `pnpm gen:component`, `pnpm gen:api`
- @repo/logger com pino + redação automática de PII
- Rate limiting example com Upstash Redis
- Docs site (`apps/docs`) com Next.js static export
- CLI de instanciação (`create-base-template`)
- .env.example documentando todas as variáveis
- CODEOWNERS para review automático
- Pre-commit hook com lint-staged
- SEO defaults: robots.ts, sitemap.ts, OpenGraph metadata
- Dockerfile para deploy containerizado

## [1.0.0] - 2025-01-15

### Added

- Monorepo Turborepo + pnpm
- Next.js 15 App Router com Server Components
- Supabase Cloud backend com tipos TypeScript gerados
- shadcn/ui componentes (Button, Card)
- Tailwind CSS v3 com tokens via CSS variables
- ESLint flat config com plugins de segurança
- TypeScript 5.9 com tipagem end-to-end
- GitHub Actions CI pipeline
- Husky + lint-staged
- ARCHITECTURE.md, README.md, SETUP.md
- .cursorrules e .windsurfrules
- VSCode extensions recomendadas
- Error boundary, loading.tsx, not-found.tsx
- Security headers no next.config.mjs
