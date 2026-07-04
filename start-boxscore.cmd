@echo off
REM Convenient Windows launcher for BoxScore Lab (production mode).
REM First-time setup: run `pnpm install`, `pnpm app:init`, and `pnpm build` once.
cd /d "%~dp0"
echo Starting BoxScore Lab...
echo Open http://localhost:4000 in your browser once the server is ready.
echo.
call pnpm start
if errorlevel 1 (
  echo.
  echo BoxScore Lab exited with an error. See the messages above.
  pause
)
