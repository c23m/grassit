@echo off
setlocal enabledelayedexpansion

cd .\backend
docker buildx build . --tag gst-backend:latest

set DOCKER_COMPOSE_CMD=docker-compose

docker compose version >nul 2>&1

if %errorlevel% equ 0 (
    set DOCKER_COMPOSE_CMD=docker compose
)

echo [INFO] Using commandl: !DOCKER_COMPOSE_CMD!

!DOCKER_COMPOSE_CMD! up -d

endlocal
