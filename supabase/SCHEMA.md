# 🗺️ SCHEMA.md - Base Template Universal

> **Fonte de Verdade:** Este documento é o GPS do sistema. Mantenha-o atualizado sempre que houver mudanças estruturais no banco de dados.

---

## 📊 Status do Banco de Dados

**Estado Atual:** ✅ **Limpo com Exemplo de RLS**  
**Última Atualização:** 2026-07-04  
**Versão da Migration:** `20260703000001_example_profiles_with_rls`

---

## 🧩 Diagrama de Relacionamentos

```mermaid
erDiagram
    %% ============================================================================
    %% BASE TEMPLATE UNIVERSAL - BANCO LIMPO
    %% ============================================================================
    %%
    %% Este template NÃO contém tabelas de negócio.
    %% Apenas extensões e funções globais estão configuradas.
    %%
    %% Quando você criar sua primeira tabela, atualize este diagrama seguindo
    %% o padrão Mermaid ER Diagram.
    %% ============================================================================

    AUTH_USERS {
        uuid id PK "Gerenciado pelo Supabase Auth"
        string email
        timestamp created_at
    }

    PROFILES {
        uuid id PK "Chave primária"
        uuid user_id FK "Referência ao auth.users"
        string full_name "Nome completo (opcional)"
        string avatar_url "URL do avatar (opcional)"
        jsonb metadata "Dados extras em JSONB"
        timestamp created_at "Timestamp de criação"
        timestamp updated_at "Timestamp de atualização (trigger)"
    }

    PROFILES ||--o{ AUTH_USERS : "pertence a"
```

---

## 🛠️ Extensões Instaladas

| Extensão              | Versão | Schema       | Descrição                                            |
| --------------------- | ------ | ------------ | ---------------------------------------------------- |
| **uuid-ossp**         | Latest | `extensions` | Geração de UUIDs (v4) para chaves primárias          |
| **pg_net**            | Latest | `extensions` | Requisições HTTP assíncronas (webhooks, integrações) |
| **vector** (pgvector) | Latest | `extensions` | Suporte a embeddings e busca semântica (IA/ML)       |

---

## 🔧 Funções Globais

### `update_timestamp()`

**Descrição:** Atualiza automaticamente o campo `updated_at` em qualquer tabela.

**Uso:**

```sql
-- Adicione este trigger em todas as tabelas que rastreiam modificações
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON sua_tabela
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

**Exemplo Completo:**

```sql
CREATE TABLE exemplo (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    nome TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Adiciona o trigger de atualização automática
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON exemplo
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

---

## 📋 Tabelas do Sistema

### `auth.users` (Gerenciado pelo Supabase)

Tabela de autenticação gerenciada automaticamente pelo Supabase Auth.

**Campos Principais:**

- `id` (UUID) - Chave primária
- `email` (TEXT) - Email do usuário
- `created_at` (TIMESTAMPTZ) - Data de criação
- `updated_at` (TIMESTAMPTZ) - Data de atualização

**⚠️ IMPORTANTE:** Nunca modifique esta tabela diretamente. Use as APIs do Supabase Auth.

---

## � Tabelas do Template

### `profiles` (Exemplo com RLS completo)

Tabela de perfil de usuário. Demonstra o padrão obrigatório: RLS + trigger de auditoria.

**Campos:**

| Campo        | Tipo        | Descrição                                   |
| ------------ | ----------- | ------------------------------------------- |
| `id`         | UUID PK     | Chave primária (auto-gerada)                |
| `user_id`    | UUID FK     | Referência a `auth.users(id)` com CASCADE   |
| `full_name`  | TEXT        | Nome completo (opcional)                    |
| `avatar_url` | TEXT        | URL do avatar (opcional)                    |
| `metadata`   | JSONB       | Dados extras em JSONB (default `{}`)        |
| `created_at` | TIMESTAMPTZ | Timestamp de criação                        |
| `updated_at` | TIMESTAMPTZ | Timestamp de atualização (auto via trigger) |

**Índices:** `idx_profiles_user_id` (busca por user_id)

**RLS:** Habilitado com 4 políticas (SELECT, INSERT, UPDATE, DELETE) — usuário só acessa próprios dados.

**Trigger:** `set_timestamp_profiles` — atualiza `updated_at` automaticamente.

> 💡 Esta tabela é um **exemplo** e pode ser deletada sem impacto no template.

---

## �🔐 Row Level Security (RLS)

**Status:** ✅ RLS habilitado na tabela exemplo `profiles`

**Políticas Configuradas:**

| Tabela     | Política              | Operação | Condição               |
| ---------- | --------------------- | -------- | ---------------------- |
| `profiles` | `profiles_select_own` | SELECT   | `auth.uid() = user_id` |
| `profiles` | `profiles_insert_own` | INSERT   | `auth.uid() = user_id` |
| `profiles` | `profiles_update_own` | UPDATE   | `auth.uid() = user_id` |
| `profiles` | `profiles_delete_own` | DELETE   | `auth.uid() = user_id` |

**Protocolo Obrigatório:**
Quando você criar sua primeira tabela:

1. **SEMPRE habilite RLS:**

   ```sql
   ALTER TABLE sua_tabela ENABLE ROW LEVEL SECURITY;
   ```

2. **Crie políticas apropriadas:**

   ```sql
   -- Exemplo: Usuários só veem seus próprios dados
   CREATE POLICY "Users can view their own data"
   ON sua_tabela
   FOR SELECT
   USING (auth.uid() = user_id);

   -- Exemplo: Usuários só inserem seus próprios dados
   CREATE POLICY "Users can insert their own data"
   ON sua_tabela
   FOR INSERT
   WITH CHECK (auth.uid() = user_id);
   ```

---

## 🚀 Próximos Passos

### Como Criar Sua Primeira Tabela

1. **Nunca use SQL manual.** Sempre gere uma migration:

   ```bash
   npx supabase migration new create_sua_tabela
   ```

2. **Edite o arquivo gerado em `./supabase/migrations/`:**

   ```sql
   CREATE TABLE sua_tabela (
       id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
       user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
       nome TEXT NOT NULL,
       created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
   );

   -- Habilita RLS
   ALTER TABLE sua_tabela ENABLE ROW LEVEL SECURITY;

   -- Adiciona políticas
   CREATE POLICY "Users can manage their own data"
   ON sua_tabela
   USING (auth.uid() = user_id)
   WITH CHECK (auth.uid() = user_id);

   -- Adiciona trigger de atualização
   CREATE TRIGGER set_timestamp
   BEFORE UPDATE ON sua_tabela
   FOR EACH ROW
   EXECUTE FUNCTION update_timestamp();
   ```

3. **Aplique a migration ao Supabase Cloud:**

   ```bash
   npx supabase db push
   ```

4. **Sincronize os tipos TypeScript:**

   ```bash
   pnpm sync-db
   ```

5. **Atualize este SCHEMA.md:**
   - Adicione a tabela ao diagrama Mermaid
   - Documente relacionamentos
   - Liste políticas RLS

---

## 📚 Referências

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [PostgreSQL Extensions](https://www.postgresql.org/docs/current/contrib.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Mermaid ER Diagrams](https://mermaid.js.org/syntax/entityRelationshipDiagram.html)

---

**🎯 Lembre-se:** Este é um **Template Universal**. Não adicione lógica de negócio aqui. Mantenha apenas infraestrutura reutilizável.
