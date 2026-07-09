-- ============================================================================
-- MIGRATION: Corrige função update_timestamp() para usar updated_at
-- ============================================================================
--
-- Contexto: A migration original (20260509000001) usava atualizado_em,
-- mas o padrão do template é inglês (updated_at). Esta migration forward
-- garante que bancos já existentes tenham a função correta.
--
-- ============================================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_timestamp() IS
'Função global de auditoria que atualiza automaticamente o campo updated_at.
Deve ser usada como trigger em todas as tabelas que rastreiam modificações.';
