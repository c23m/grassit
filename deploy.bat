@echo off
setlocal enabledelayedexpansion

REM 切换到 backend 目录
cd /d "%~dp0backend" 2>nul || (
    echo Error: Cannot find backend directory.
    exit /b 1
)

echo Building Docker image...
docker buildx build . --tag gst-backend:latest
if errorlevel 1 (
    echo Error: Docker build failed.
    exit /b 1
)

REM 检测可用的 docker compose 命令
set DOCKER_COMPOSE_CMD=
docker compose version >nul 2>&1
if errorlevel 1 (
    REM 尝试旧版 docker-compose
    where docker-compose >nul 2>&1
    if errorlevel 1 (
        echo Error: 'docker compose' or 'docker-compose' not found.
        exit /b 1
    ) else (
        set DOCKER_COMPOSE_CMD=docker-compose
    )
) else (
    set DOCKER_COMPOSE_CMD=docker compose
)

REM 返回项目根目录（脚本所在目录）
cd /d "%~dp0"

echo Executing command: !DOCKER_COMPOSE_CMD!
!DOCKER_COMPOSE_CMD! up -d
if errorlevel 1 (
    echo Error: docker compose up failed.
    exit /b 1
)

REM 询问是否创建测试数据
set /p answer=Create test data for database(grassit_db) [y/N]? 
if /i "!answer!"=="y" (
    echo Creating test data...
    docker exec -i mysql-server mysql -u root -p grassit_db < backend\test_data.sql
    if errorlevel 1 (
        echo Warning: Test data creation may have failed.
    ) else (
        echo Test data created.
    )
) else (
    echo Skipped test data creation.
)

endlocal