🏗️ Arquitetura de Missão Crítica: Base Template MÁXIMA

Este documento detalha os pilares arquiteturais que permitem que este template escale do MVP (Vendedor de Brigadeiro) ao Enterprise (NASA/Supermercado Global) sem necessidade de refatoração estrutural.

1. O Princípio do DNA e do Cérebro
   A base é dividida em duas camadas de responsabilidade:

DNA (Código): O mínimo viável para execução. Se o desenvolvedor precisa deletar algo para começar, o DNA falhou.

Cérebro (Documentação/Guias): A inteligência para lidar com complexidade. A complexidade não é imposta, é disponibilizada sob demanda.

2. Camada de Dados: Resiliência e Agnosticismo
   Não consumimos o Supabase (ou qualquer DB) diretamente nos componentes.

2.1 Result Pattern (Tratamento de Erros de Elite)
Abstraímos falhas de rede e banco através do tipo Result<T, E>.

Por quê? Força o desenvolvedor a tratar o erro no momento da chamada, evitando telas brancas e comportamentos imprevisíveis.

Uso: const { data, error } = await supabase.getUser();

2.2 Camada de Adaptação (Anti-Lock-in)
O pacote @repo/supabase exporta Fábricas de Clients. Se houver necessidade de migrar para PostgreSQL puro, Oracle ou uma API de terceiros, a mudança ocorre estritamente dentro do pacote, mantendo o apps/web intacto.

3. Design System: Primitivos vs. Composição
   O pacote @repo/ui segue a filosofia de Componentes Atômicos.

Regra de Ouro: Componentes em @repo/ui devem ser "burros" e puros. Eles não possuem lógica de negócio, não fazem fetch de dados e não dependem de contextos do apps/.

Composição: A lógica de negócio reside no apps/, que compõe os primitivos do @repo/ui. Isso permite que o design system seja compartilhado entre um App de Vendas e um Painel Administrativo com necessidades visuais distintas.

Componentes inclusos no template: Button (cva + Radix Slot, 6 variants × 4 sizes) e Card (Header, Title, Description, Content, Footer). CSS variables HSL (neutral base, light/dark) em @repo/tailwind-config/globals.css. Tailwind config mapeia cores para as CSS variables. Adicione mais componentes via `npx shadcn@latest add <component>`.

4. Segurança e Isolamento (Multi-tenancy)
   Para escala Enterprise, o isolamento de dados é nativo via Row Level Security (RLS).

Escalabilidade: Toda query ao banco deve ser filtrada por user_id ou tenant_id no nível do banco (RLS), e não na aplicação. Isso garante que, mesmo com um bug no front-end, o dado de um cliente nunca vaze para outro.

4.1 Segurança como DNA (Built-in)

O template inclui segurança de base sem exigir ação do desenvolvedor:

- SAST Leve: eslint-plugin-security integrado no @repo/eslint-config. Detecta padrões inseguros (eval, child_process, regex DoS) em todo commit.
- Gestão de Dependências: Dependabot ativo monitora vulnerabilidades em todas as dependências npm e GitHub Actions semanalmente.
- Auditoria de Dependências: pnpm audit roda no CI a cada push e PR, falhando em vulnerabilidades de nível alto.
- Type Safety como Defesa: database.types.ts proíbe queries a tabelas inexistentes ou colunas erradas. O TypeScript é a primeira camada anti-alucinação.
- Validação de Env Vars: t3-env falha no build-time se variáveis críticas estiverem ausentes. Nunca em runtime.
- Auth Centralizada: @repo/supabase middleware gerencia sessão SSR. Route handler /auth/callback completa o loop OAuth. Nenhum app precisa reimplementar autenticação.
- RLS Obrigatório: Protocolo em SCHEMA.md exige RLS em toda tabela. Sem exceções.
- 100% Cloud Workflow: Sem Docker local. Supabase Cloud, Vercel, GitHub Codespaces. Dev container na nuvem.
- Security Headers: next.config.mjs define X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy, Permissions-Policy. Aplicados em todas as rotas.
- Error Boundaries: error.tsx captura erros de runtime em Server Components com fallback e botão de retry. not-found.tsx substitui 404 genérica. loading.tsx fornece fallback durante streaming.

  4.2 Segurança como Guideline (Documentação)

Práticas que devem ser seguidas mas não são código de template:

- Validação de Input (OWASP): Use Zod para validar todo input externo (forms, query params, API payloads). Nunca confie em dados do cliente.
- Tratamento de Erros Sem Vazamento: Error boundaries e Result Pattern garantem que erros internos nunca exponham stack traces ou dados sensíveis ao usuário final.
- Logs Seguros: Nunca logue senhas, tokens, PII ou dados sensíveis. Use o @repo/logger (quando implementado) com redação automática.
- Princípio do Menor Privilégio: RLS políticas devem conceder apenas o necessário. SELECT quando só precisa ler. Não conceda ALL sem justificativa.
- Rate Limiting: Para APIs públicas, configure rate limiting no middleware ou gateway. Next.js middleware suporta implementação simples com Upstash Redis.
- HTTPS/TLS: Garantido pela infra (Vercel/Supabase). Nunca desabilite TLS em qualquer ambiente.

5. DX (Developer Experience) e Rigor Técnico

Verificação de Build: O t3-env garante que o sistema falhe no build-time se faltarem variáveis de ambiente, nunca em runtime.

Contratos de Tipo: O database.types.ts é a única fonte de verdade. Alterações no banco geram erros de tipo imediatos no código, prevenindo bugs de integração.

🚀 Guia de Escala (The MEGA-TECH Path)

Como adicionar Internacionalização (i18n)?

Não instale libs pesadas de imediato. Use a estrutura de dictionaries nativa do Next.js App Router. Mova as traduções para um pacote @repo/i18n apenas quando houver mais de 3 apps consumindo os mesmos termos.

Como adicionar Observabilidade?

Integre o OpenTelemetry no pacote @repo/logger. No nível Enterprise, conecte os traces a ferramentas como Datadog ou New Relic sem alterar a sintaxe de log no apps/.

Como lidar com Processamento em Background?

Sistemas de missão crítica (ex: emissão de Nota Fiscal ou Manobra de Satélite) não rodam no request principal. Use o guia de Idempotência + Filas (Inngest/Upstash) para garantir que a falha de uma etapa não comprometa a transação financeira ou operacional.

# Guia de Arquitetura — Escala MEGA-TECH

> Este documento é o "manual do arquiteto". Ele não está no código porque nem todo projeto precisa.
> Leia quando seu projeto crescer além do MVP.

---

## Por Que as Coisas São Assim

### Packages separados em vez de pastas no app

O `@repo/supabase` existe como package porque:

- Se você adicionar `apps/admin`, ele importa o mesmo client tipado sem duplicar código.
- Se o banco mudar uma coluna, você ajusta em UM lugar (o package) — não em 50 arquivos.
- O package é o "amortecedor" entre o banco e os apps.

### Result Pattern em vez de try/catch

```typescript
type Result<T> = { data: T; error: null } | { data: null; error: AppError };
```

Isso força o dev a tratar erros. Sem isso, um `undefined` silencioso causa tela branca em produção.

### Env validation no build-time

Se `SUPABASE_URL` não estiver definida, o Next.js **nem sobe**. Isso evita 90% dos tickets de "funciona na minha máquina".

---

### Configurações pnpm e Gerenciamento de Dependências

**Por que `.npmrc` tem `auto-install-peers=true`?**

O pnpm por padrão NÃO instala `peerDependencies` automaticamente. Em um monorepo com ESLint 9 + plugins React + Next.js, isso gera warnings constantes de peer deps não resolvidas. A configuração `auto-install-peers=true` resolve isso sem comprometer segurança:

- Instala apenas peer deps declaradas (não é hoisting)
- Não cria phantom dependencies (diferente de `shamefully-hoist`)
- Mantém a estrutura estrita de `node_modules` do pnpm

**Por que `strict-peer-dependencies=false`?**

Plugins ESLint como `eslint-plugin-react` ainda não declararam compatibilidade formal com ESLint 10 em seus `peerDependencies`. Sem essa flag, o pnpm bloquearia a instalação. A flag permite instalar com warning, sem comprometer o runtime.

**Por que NÃO usar `shamefully-hoist=true`?**

`shamefully-hoist` move dependências para o `node_modules` raiz, criando uma estrutura similar ao npm tradicional. Isso parece conveniente, mas compromete segurança:

- Cria "phantom dependencies" — dependências que funcionam mas não estão declaradas no `package.json`
- Perde a garantia estrita de versões que o pnpm oferece
- Pode causar conflitos em monorepos grandes
- Em nível Enterprise (NASA), isso é inaceitável — você quer controle total sobre o que está instalado

**Quando usar `shamefully-hoist`:**

Apenas em edge cases específicos identificados pelo desenvolvedor:

- Ferramentas legadas que não funcionam com estrutura pnpm
- Problemas de compatibilidade específicos que não têm solução alternativa
- Adicione localmente no projeto quando identificar o problema, não no template

---

### Configurações Turborepo

**Por que `turbo.json` é minimalista?**

O `turbo.json` atual define as tarefas essenciais (`build`, `lint`, `check-types`, `dev`) com configurações básicas de cache e dependências. Isso é deliberado:

**Razões:**

- Cada projeto pode ter tarefas específicas (test, e2e, storybook, etc.)
- Cache e outputs são configurados por tarefa para evitar cache poisoning
- Configurações adicionais podem ser adicionadas quando necessário pelo projeto

**Otimização de Cache com Outputs:**

O cache do Turborepo está configurado com outputs vazios para `lint` e `check-types`, o que significa que o Turbo memoriza o sucesso da execução. Se o código não mudar, o check leva milissegundos. Para `build`, outputs específicos (`.next/**`, `dist/**`) são definidos para permitir cache inteligente de artefatos de build.

**Trade-off:**
Template minimalista vs configuração completa. A decisão é manter minimalista para não engessar projetos que não precisam de tarefas específicas.

---

### Configurações TypeScript

**Por que `tsconfig.json` herda de `@repo/typescript-config`?**

Centralização de configurações TypeScript garante consistência em todo o monorepo:

**Benefícios:**

- Alterações de configuração em um lugar afetam todos os packages
- Garante que todos os packages usam as mesmas regras estritas
- Facilita upgrade de versões do TypeScript

**Estrutura:**

- `base.json` — Configurações fundamentais (strict, moduleResolution, etc)
- `nextjs.json` — Extende `base.json` com configurações específicas do Next.js

**Trade-off:**
Centralização vs flexibilidade. A decisão é centralizar para garantir consistência, mas cada app pode sobrescrever configurações específicas em seu `tsconfig.json`.

---

### Configurações ESLint

**Por que ESLint usa Flat Config (`.mjs`) em vez de `.eslintrc`?**

ESLint Flat Config é o futuro do ESLint:

**Benefícios:**

- Sintaxe mais clara e programática
- Melhor performance em grandes monorepos
- Compatibilidade com ferramentas modernas

**Estrutura:**

- `@repo/eslint-config/base.mjs` — Configuração base (TypeScript + React + React Hooks + SAST security)
- `@repo/eslint-config/next.mjs` — Configuração para apps Next.js (base + regras Next.js + core-web-vitals)

**Trade-off:**
Nova sintaxe vs compatibilidade legada. A decisão é usar Flat Config porque é o futuro e o template é para projetos modernos.

---

## Guias de Escala

### 1. Repository Pattern (Quando Precisar)

Se o projeto crescer e precisar abstrair o Supabase:

```typescript
// packages/supabase/src/repositories/user.repository.ts
import type { Result } from "../types";

export interface UserRepository {
  getById(id: string): Promise<Result<User>>;
  create(data: CreateUserDTO): Promise<Result<User>>;
}

// Implementação Supabase
export class SupabaseUserRepository implements UserRepository {
  constructor(private client: SupabaseClient) {}

  async getById(id: string): Promise<Result<User>> {
    const { data, error } = await this.client
      .from("users")
      .select()
      .eq("id", id)
      .single();
    if (error) return err(error.message);
    return ok(data);
  }
}
```

**Quando usar:** Quando houver mais de um data source, ou quando testes unitários exigirem mocks do banco.

**Quando NÃO usar:** No MVP. Chamadas diretas ao Supabase são perfeitamente válidas para projetos pequenos.

---

### 2. Multi-tenancy (SaaS)

Para isolar dados entre organizações:

```sql
-- Migration: add_tenant_isolation
ALTER TABLE sua_tabela ADD COLUMN org_id UUID REFERENCES orgs(id);

CREATE POLICY "Tenant isolation"
ON sua_tabela
USING (org_id = (SELECT org_id FROM profiles WHERE id = auth.uid()));
```

O RLS do Supabase é nativo para isso. Não precisa de lógica no app — o banco garante isolamento.

---

### 3. Audit Logs (Rastreabilidade)

Para sistemas que exigem rastro imutável:

```sql
-- Migration: create_audit_logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger genérico
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

---

### 4. RBAC (Permissões por Role)

Para controle de acesso granular:

```sql
-- Enum de roles
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'member', 'viewer');

-- Coluna na tabela de profiles
ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'member';

-- Política baseada em role
CREATE POLICY "Admins can see all"
ON sensitive_data
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

---

### 5. Internacionalização (i18n)

Para apps multi-idioma com Next.js:

```
apps/web/
├── messages/
│   ├── pt-BR.json
│   └── en.json
├── i18n/
│   ├── request.ts
│   └── routing.ts
└── middleware.ts  (adicionar locale detection)
```

Recomendação: Use `next-intl` para App Router. Ele suporta Server Components nativamente.

---

### 6. Background Jobs e Filas

Para processamento assíncrono:

**Opção A: Supabase Edge Functions + pg_net**

```sql
-- Dispara webhook após INSERT
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    'https://seu-app.com/api/webhooks/new-order',
    jsonb_build_object('order_id', NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Opção B: Inngest (recomendado para complexidade)**

```typescript
// apps/web/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processOrder } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processOrder],
});
```

---

### 7. Observabilidade (OpenTelemetry)

Para rastrear requests em produção:

```typescript
// instrumentation.ts (Next.js)
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { NodeSDK } = await import("@opentelemetry/sdk-node");
    const sdk = new NodeSDK({/* config */});
    sdk.start();
  }
}
```

Providers compatíveis: Vercel (built-in), Datadog, Grafana, Sentry.

---

### 8. Cache e Revalidação (Next.js)

Padrão de tags para evitar dados obsoletos:

```typescript
// Fetch com tag
const { data } = await supabase
  .from("products")
  .select()
  .then((res) => res);

// No Route Handler:
export async function GET() {
  return NextResponse.json(data, {
    headers: { "Cache-Tag": "products" },
  });
}

// Revalidar quando produto mudar:
import { revalidateTag } from "next/cache";
revalidateTag("products");
```

---

### 9. Edge-Runtime Checklist

Para garantir que o app rode na borda (Vercel Edge, Cloudflare):

- [ ] Nenhum package usa `fs`, `path`, ou APIs Node.js pesadas
- [ ] `@repo/supabase` usa apenas `fetch` internamente (já compatível)
- [ ] Middleware do Next.js já roda em Edge por padrão
- [ ] Evitar `crypto.randomUUID()` em Edge — use `uuid` do Supabase

---

### 10. Graceful Degradation

Estruture o app para funcionar "pela metade":

```
apps/web/app/
├── (core)/          # Funcionalidades essenciais (sempre online)
│   ├── dashboard/
│   └── settings/
└── (features)/      # Features adicionais (podem falhar sem derrubar o core)
    ├── analytics/
    └── recommendations/
```

Se o serviço de recomendações cair, o dashboard continua funcionando.

---

## Decisões Arquiteturais (ADRs)

| #   | Decisão                                    | Razão                                                                                                                                                               |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Supabase em vez de Prisma                  | Auth + Realtime + Storage integrados. Menos boilerplate.                                                                                                            |
| 2   | Tailwind v3 em vez de v4                   | Estável, maduro, amplamente adotado. v4 ainda em beta.                                                                                                              |
| 3   | Result Pattern em vez de exceptions        | Força tratamento de erro. Compatível com Server Components.                                                                                                         |
| 4   | shadcn/ui em vez de MUI/Chakra             | Componentes copiáveis, sem lock-in. Usa Radix por baixo.                                                                                                            |
| 5   | Vitest em vez de Jest                      | 10x mais rápido, ESM nativo, compatível com Turborepo.                                                                                                              |
| 6   | t3-env em vez de dotenv manual             | Validação em build-time. Type-safe.                                                                                                                                 |
| 7   | eslint-plugin-security no CI               | SAST leve sem fricção. Detecta padrões inseguros no commit.                                                                                                         |
| 8   | Dependabot + pnpm audit                    | Gestão automatizada de cadeia de suprimentos. SBOM implícito.                                                                                                       |
| 9   | RLS obrigatório em toda tabela             | Isolamento de dados no banco, não na aplicação. Defense in depth.                                                                                                   |
| 10  | shadcn/ui componentes no template          | Provar o padrão de design system no DNA. Button + Card como vertical slice demo.                                                                                    |
| 11  | next-intl removido do template             | Dependência instalada mas non-functional configuração incompleta. Removida para evitar peso morto. Reativar via `next-intl` setup guide quando i18n for necessário. |
| 12  | updateSession retorna `{ response, user }` | Elimina double `getUser()` no middleware. Uma única chamada de auth no edge.                                                                                        |
| 13  | env.ts importado no next.config.mjs        | Validação de env vars em build-time. Falha fast se variáveis obrigatórias faltam.                                                                                   |

---

### 11. Caminhos de Escala — Segurança Enterprise

Quando o projeto crescer além do MVP e precisar de segurança de nível enterprise:

**Rate Limiting e API Gateway:**

- Use Upstash Redis + Next.js middleware para rate limiting simples
- Para escala maior, adicione um API Gateway (Cloudflare, Kong) com OAuth 2.0 / JWT

**Observabilidade e Auditoria (SIEM):**

- Integre OpenTelemetry no @repo/logger (ver Guia de Escala #7)
- Conecte traces a Datadog, Grafana ou Sentry
- Para SIEM completo, exporte logs estruturados para ferramentas de correlação

**DAST (Análise Dinâmica):**

- Adicione OWASP ZAP ou Burp Suite no pipeline de staging
- Rode scans automatizados contra o ambiente de preview

**Zero Trust e Microsegmentação:**

- Isole microsserviços em VPCs separadas
- Exija autenticação entre serviços (service-to-service tokens)
- Não confie em requisições apenas por estarem na mesma rede

**Confidential Computing (TEEs):**

- Para dados ultra-sensíveis processados em runtime
- Disponível em clouds específicas (AWS Nitro Enclaves, Azure Confidential Computing)
- Requer arquitetura dedicada — não aplicável ao template base

**Criptografia Pós-Quântica (PQC):**

- Prematuro para stack web em 2025. Monitorar padronização NIST.
- Quando disponível em bibliotecas TLS, atualizar sem mudança de código.

**Chaos Security Engineering:**

- Injeção proativa de falhas em produção (estilo Chaos Monkey)
- Testa se detecção automática responde em segundos
- Requer equipe dedicada e ambiente de produção estável

---

## Quando Este Template NÃO Serve

- **Apps estáticos puros** (use Astro ou 11ty)
- **APIs sem frontend** (use Hono ou Fastify direto)
- **Apps mobile-only** (use Expo com Supabase diretamente)
- **Sistemas legados** que exigem SQL Server/Oracle (mas o Repository Pattern ajuda na migração)

---

## Arquitetura Multi-Tenant (Sob Demanda)

Este template suporta multi-tenancy sem refatoração estrutural. Ative quando precisar.

### Estratégia: Row-Level Security (RLS) com `tenant_id`

A estratégia recomendada usa RLS do Postgres (Supabase) — zero código de aplicação para isolamento.

#### 1. Schema (Migration)

```sql
-- Adiciona tenant_id em todas as tabelas de negócio
ALTER TABLE profiles ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- Política RLS: usuário só vê dados do seu tenant
CREATE POLICY tenant_isolation ON profiles
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::UUID);
```

#### 2. JWT Custom Claims

Configure no Supabase Auth > JWT Hooks para injetar `tenant_id` no token:

```json
{
  "tenant_id": "uuid-do-tenant"
}
```

#### 3. Query automática

O RLS filtra automaticamente — nenhum `WHERE tenant_id = ?` no código.

```typescript
// Sem mudança no código — RLS filtra automaticamente
const { data } = await supabase.from("profiles").select("*");
// data contém apenas perfis do tenant do usuário logado
```

#### 4. Middleware (opcional)

Para validação extra no edge:

```typescript
// Em middleware.ts
const tenantId = request.headers.get("x-tenant-id");
if (!tenantId)
  return NextResponse.redirect(new URL("/select-tenant", request.url));
```

### Quando NÃO usar multi-tenant

- **Single-tenant SaaS**: Cada cliente tem seu próprio Supabase project
- **B2C apps**: Usuários individuais, sem organização
- **Internal tools**: Um único tenant

### Escala: MVP → Enterprise

| Fase       | Estratégia                              | Custo                   |
| ---------- | --------------------------------------- | ----------------------- |
| MVP        | Shared schema + RLS                     | $0 (Supabase free tier) |
| Growth     | Shared schema + RLS + read replicas     | $25/mês                 |
| Enterprise | Schema-per-tenant ou dedicated projects | $500+/mês               |
