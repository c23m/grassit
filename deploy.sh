#!/bin/bash

cd backend
docker buildx build . --tag gst-backend:latest

if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "Error: 'docker compose' or 'docker-compose' not found."
    exit 1
fi

cd ..
echo "Executing command: $DOCKER_COMPOSE_CMD"
$DOCKER_COMPOSE_CMD up -d

read -p "Please input the password for MySQL root user: " mysql_root_password

read -p "Create test data for database(grassit_db) [y/N] " answer
if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
    echo "Creating test data..."
    echo "Please copy the following command and execute it after you entered. Then you can exit the MySQL system by command 'exit'"
    echo "    CREATE DATABASE IF NOT EXISTS grassit_db;"
    confirm=n
    while [[ "$confirm" != "y" && "$confirm" != "Y" ]]; do
        read -p "You've got what to do next? [y/N] " confirm
    done
    docker exec -it mysql-server mysql -u root -p"$mysql_root_password"
    docker exec -i mysql-server mysql -u root -p"$mysql_root_password" grassit_db < storage/test/grassit_db_test.sql
    echo "Test data created."
elif [[ "$answer" == "n" || "$answer" == "N" || -z "$answer" ]]; then
    echo "Skipped test data creation."
fi
