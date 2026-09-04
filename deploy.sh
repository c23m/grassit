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
exec $DOCKER_COMPOSE_CMD up -d

read -p "Create test data for database(grassit_db) [y/N]" answer
if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
    echo "Creating test data..."
    docker exec -i mysql-server mysql -u root -p grassit_db < backend/test_data.sql
    echo "Test data created."
elif [[ "$answer" == "n" || "$answer" == "N" || -z "$answer" ]]; then
    echo "Skipped test data creation."
fi
