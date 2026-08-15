@echo off
setlocal
cd /d "%~dp0"
title WorkForge - servidor local

echo.
echo ========================================
echo   WorkForge v0.5 - inicializacao local
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERRO: Node.js nao foi encontrado.
  echo Instale a versao LTS e tente novamente.
  goto :failed
)

echo [1/3] Preparando o pnpm...
call corepack enable >nul 2>nul

if not exist node_modules\vite\bin\vite.js (
  echo [2/3] Instalando dependencias...
  call corepack pnpm@11.13.0 install --force
  if errorlevel 1 goto :install_failed
) else (
  echo [2/3] Dependencias ja instaladas.
)

echo [3/3] Iniciando o servidor...
echo.
echo O terminal deve permanecer aberto enquanto o WorkForge estiver rodando.
echo Acesse: http://localhost:4173/login
echo.
call corepack pnpm@11.13.0 run dev
if errorlevel 1 goto :failed
goto :end

:install_failed
echo.
echo A instalacao foi bloqueada pelo gerenciador de pacotes.
echo Tentando autorizar apenas o build local do esbuild...
call corepack pnpm@11.13.0 approve-builds esbuild
if errorlevel 1 goto :failed
call corepack pnpm@11.13.0 install --force
if errorlevel 1 goto :failed
call corepack pnpm@11.13.0 run dev
if errorlevel 1 goto :failed
goto :end

:failed
echo.
echo Nao foi possivel iniciar o projeto.
echo Esta janela permanecera aberta para voce ler o erro.
pause

:end
endlocal
