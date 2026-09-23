#!/bin/bash

cd backend
docker buildx build . --tag grassit-backend:latest

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
