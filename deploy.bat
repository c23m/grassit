@echo off
setlocal enabledelayedexpansion

REM 切换到 backend 目录并构建镜像
cd backend
docker buildx build . --tag gst-backend:latest

REM 检测 Docker Compose 命令（优先使用 "docker compose"，否则回退 "docker-compose"）
docker compose version >nul 2>&1
if %errorlevel%==0 (
    set DOCKER_COMPOSE_CMD=docker compose
) else (
    docker-compose --version >nul 2>&1
    if %errorlevel%==0 (
        set DOCKER_COMPOSE_CMD=docker-compose
    ) else (
        echo Error: 'docker compose' or 'docker-compose' not found.
        exit /b 1
    )
)

REM 返回项目根目录
cd ..

echo Executing command: %DOCKER_COMPOSE_CMD%
%DOCKER_COMPOSE_CMD% up -d

REM 询问是否创建测试数据
set /p answer="Create test data for database(grassit_db) [y/N] "

REM 如果输入 y 或 Y（不区分大小写）则执行创建
if /i "%answer%"=="y" (
    set /p mysql_root_password="Please input the password for MySQL root user: "
    echo Creating test data...
    echo Please copy the following command and execute it after you entered. Then you can exit the MySQL system by command 'exit'
    echo     CREATE DATABASE IF NOT EXISTS grassit_db;

    REM 等待用户确认已经准备好执行下一步
    :confirm_loop
    set /p confirm="You've got what to do next? [y/N] "
    if /i not "!confirm!"=="y" goto confirm_loop

    REM 打开交互式 MySQL 客户端，供用户手动执行 CREATE DATABASE
    docker exec -it mysql-server mysql -u root -p%mysql_root_password%

    REM 导入测试数据（使用重定向）
    docker exec -i mysql-server mysql -u root -p%mysql_root_password% grassit_db < storage/test/grassit_db_test.sql

    echo Test data created.
) else (
    echo Skipped test data creation.
)

endlocal