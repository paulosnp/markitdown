@echo off
title MarkItDown - Frontend + API
echo.
echo  ==============================
echo   MarkItDown - Iniciando...
echo  ==============================
echo.

:: Inicia a API Python em background
echo [1/2] Iniciando API na porta 7860...
start "MarkItDown API" /min cmd /c "cd /d %~dp0 && python server.py"

:: Aguarda 2 segundos para a API subir
timeout /t 2 /nobreak > nul

:: Inicia o frontend
echo [2/2] Iniciando frontend na porta 6699...
echo.
echo  API:      http://localhost:7860
echo  Frontend: http://localhost:6699
echo.
echo  Pressione Ctrl+C para encerrar o frontend.
echo  Feche a janela "MarkItDown API" para encerrar a API.
echo.

cd /d %~dp0
call npm run dev
