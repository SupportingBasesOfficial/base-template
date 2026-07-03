-- ============================================================================
-- MIGRATION: Example Table with RLS - Base Template Universal
-- ============================================================================
-- Descrição: Exemplo de criação de tabela com Row Level Security (RLS).
--            Use como referência ao criar suas próprias tabelas.
--            Pode ser deletado sem impacto no template.
-- Data: 2026-07-03
-- ============================================================================

-- ============================================================================
-- TABELA: profiles (exemplo)
-- ============================================================================
-- Relaciona-se com auth.users via user_id.
-- Demonstra o padrão obrigatório: RLS + trigger de auditoria.

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Índice para busca por user_id (comum em joins)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Obrigatório em TODAS as tabelas. Sem exceção.

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só veem seu próprio perfil
CREATE POLICY "profiles_select_own"
  ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários só inserem seu próprio perfil
CREATE POLICY "profiles_insert_own"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários só atualizam seu próprio perfil
CREATE POLICY "profiles_update_own"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários só deletam seu próprio perfil
CREATE POLICY "profiles_delete_own"
  ON profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGER DE AUDITORIA
-- ============================================================================

CREATE TRIGGER set_timestamp_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================

COMMENT ON TABLE profiles IS
'Perfil do usuário. Exemplo de tabela com RLS completo. Pode ser deletado.';

COMMENT ON COLUMN profiles.metadata IS
'Dados extras em JSONB. Use para campos opcionais sem alterar schema.';

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================
