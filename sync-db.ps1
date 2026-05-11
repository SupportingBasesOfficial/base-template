# Sincronizador de Banco para IA
Write-Host "--- Iniciando Sincronizacao ---" -ForegroundColor Cyan

# 1. Gera os tipos do TypeScript
Write-Host "1. Lendo estrutura do banco no Docker..." -ForegroundColor Yellow
$types = npx supabase gen types typescript --local
[System.IO.File]::WriteAllText("$PSScriptRoot/packages/typescript-config/database.types.ts", ($types -join "`n"), [System.Text.UTF8Encoding]::new($false))

# 2. Atualiza o Turborepo
Write-Host "2. Atualizando definicoes do projeto..." -ForegroundColor Yellow
pnpm build --filter "@repo/typescript-config"

Write-Host "OK: Sincronizacao Concluida!" -ForegroundColor Green
Write-Host "Dica: No Windsurf, use #database.types.ts para contexto." -ForegroundColor DarkCyan 

