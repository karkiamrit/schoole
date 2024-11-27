#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
    echo "Starting in production mode..."
    exec pnpm start:prod
else
    echo "Starting in development mode..."
    exec pnpm dev
fi