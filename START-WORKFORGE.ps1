$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

try {
  Write-Host "WorkForge v0.5 - inicializacao local" -ForegroundColor Cyan
  corepack enable | Out-Null

  if (-not (Test-Path '.\node_modules\vite\bin\vite.js')) {
    Write-Host "Instalando dependencias..."
    try {
      corepack pnpm@11.13.0 install --force
    } catch {
      Write-Host "Autorizando somente o build do esbuild..." -ForegroundColor Yellow
      corepack pnpm@11.13.0 approve-builds esbuild
      corepack pnpm@11.13.0 install --force
    }
  }

  Write-Host "Servidor: http://localhost:4173/login" -ForegroundColor Green
  Write-Host "Mantenha este terminal aberto." -ForegroundColor DarkGray
  corepack pnpm@11.13.0 run dev
} catch {
  Write-Host "`nFalha ao iniciar: $($_.Exception.Message)" -ForegroundColor Red
  Read-Host "Pressione Enter para fechar"
  exit 1
}
