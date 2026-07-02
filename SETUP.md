# SETUP.md — Protocolo de Instanciação de Novo Projeto

> Execute este protocolo completo ao criar qualquer novo projeto a partir do base-template.
> 100% Cloud Workflow. Sem Docker local. Sem supabase start.

---

## Por que este protocolo existe

O base-template é DNA universal — mente limpa, sem projeto específico.
Este protocolo garante que cada projeto instanciado nasce com:

- A corrente de type-safety fechada (DB Cloud → tipos → services → UI)
- CI completo (lint → audit → types → build → test)
- Deploy automático na Vercel
- Dev environment via GitHub Codespaces
- Documentação viva do banco (`supabase/SCHEMA.md`)
- Workflow de sync de tipos (`pnpm sync-db`)

---

## Checklist de Instanciação

### Passo 1 — Scaffold do repositório

```bash
# Clone ou fork o base-template
git clone <base-template-url> <nome-do-projeto>
cd <nome-do-projeto>

# Reinicialize o git
rm -rf .git
git init
git branch -m main
```

### Passo 2 — Identidade do projeto

Editar `package.json` raiz:

- [ ] `name`: `@[org]/[projeto]`
- [ ] `description`: descrição do projeto
- [ ] `author`: nome da organização
- [ ] `repository.url`: URL do repo GitHub

### Passo 3 — Criar `.windsurfrules` específico do projeto

Copiar o template abaixo e preencher os campos marcados com `[...]`:

```markdown
# [Nome do Projeto] — Diretrizes para IA

## Contexto deste Workspace

Instanciado do base-template
Regras universais de stack: .windsurfrules do base-template

## Fontes de Conhecimento

- [caminho para docs institucionais do projeto]
- supabase/SCHEMA.md — estado atual do banco

## Regras Específicas deste Projeto

[adicionar aqui as regras específicas do projeto]

## Fontes de Verdade

- database.types.ts — gerado por pnpm sync-db — nunca editar manualmente
- supabase/migrations/ — fonte de verdade do schema
- supabase/SCHEMA.md — documentação viva do banco
```

- [ ] `.windsurfrules` criado e preenchido
- [ ] `.cursorrules` criado (versão compacta do mesmo conteúdo)

### Passo 4 — Supabase Cloud

```bash
# 1. Criar projeto no Supabase Cloud
#    https://supabase.com/dashboard > New Project

# 2. Obter credenciais:
#    - Project URL: Settings > API > Project URL
#    - Anon Key: Settings > API > Project API Keys > anon
#    - Project Ref: Settings > General > Reference ID

# 3. Atualizar project_id em supabase/config.toml
#    project_id = "nome-do-projeto"

# 4. Login na Supabase CLI (interativo ou token)
npx supabase login

# 5. Linkar projeto local ao cloud
npx supabase link --project-ref <seu-project-ref>
```

- [ ] Projeto Supabase Cloud criado
- [ ] `supabase/config.toml` com `project_id` correto
- [ ] `supabase/SCHEMA.md` atualizado
- [ ] Supabase CLI linkada ao projeto cloud

### Passo 5 — Variáveis de ambiente

- [ ] `apps/web/.env.example` com todas as variáveis necessárias
- [ ] Copiar `.env.example` para `.env` e preencher com valores do Supabase Cloud
- [ ] Adicionar secrets no GitHub: Settings > Codespaces > Secrets
- [ ] Adicionar envs na Vercel: Project Settings > Environment Variables

**Variáveis obrigatórias:**

| Variável                        | Onde encontrar                          |
| ------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase Dashboard > Settings > API     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API     |
| `SUPABASE_PROJECT_REF`          | Supabase Dashboard > Settings > General |

### Passo 6 — Vercel

```bash
# Conectar repo à Vercel
# https://vercel.com/new > Import Git Repository

# OU via CLI:
vercel link
vercel env pull
```

- [ ] Projeto conectado à Vercel
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] `vercel.json` presente na raiz

### Passo 7 — CI

- [ ] `.github/workflows/ci.yml` com placeholder env vars para build
- [ ] `concurrency` group configurado
- [ ] Node.js version alinhada com `.nvmrc`

### Passo 8 — Primeira execução (via Codespaces)

```bash
# Abrir no Codespaces: GitHub > Repo > Code > Codespaces > Create

pnpm install
npx supabase db push    # aplica migrations ao cloud
pnpm sync-db            # sincroniza tipos do cloud
pnpm test:run           # deve passar
pnpm check-types        # deve passar
pnpm lint               # deve passar
```

- [ ] Todos os três passando antes do primeiro commit

### Passo 9 — Primeiro commit

```bash
git add -A
git commit -m "chore: scaffold inicial do projeto — instanciado do base-template"
git remote add origin <url-do-repo>
git push -u origin main
```

- [ ] CI passando no GitHub após o push
- [ ] Vercel deploy automático concluído

---

## O que NÃO fazer

- Nunca iniciar desenvolvimento antes de todos os 9 passos estarem completos
- Nunca criar tabelas sem migration (`supabase migration new`)
- Nunca editar `database.types.ts` manualmente
- Nunca commitar sem `pnpm check-types && pnpm lint && pnpm test:run` passando
- Nunca contaminar o base-template com regras ou código específicos de projeto
- Nunca usar `npx supabase start` — use Supabase Cloud diretamente
- Nunca use `npx supabase db reset` — use `npx supabase db push` para cloud

---

## Referência Rápida pós-instanciação

| Ação              | Comando                                          |
| ----------------- | ------------------------------------------------ |
| Dev (Codespace)   | `pnpm dev`                                       |
| Build             | `pnpm build`                                     |
| Testes            | `pnpm test:run`                                  |
| Type check        | `pnpm check-types`                               |
| Nova migration    | `npx supabase migration new YYYYMMDDHHMMSS_desc` |
| Aplicar migration | `npx supabase db push`                           |
| Sync tipos        | `pnpm sync-db`                                   |
| Deploy (manual)   | `vercel --prod`                                  |
| Abrir Codespace   | GitHub > Repo > Code > Codespaces > Create       |
