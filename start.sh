#!/bin/bash

# Start script for EasyPanel deployment
echo "Starting Living Portfolio with AI..."

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "Error: NEXT_PUBLIC_SUPABASE_URL is not set"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
    exit 1
fi

if [ -z "$MISTRAL_API_KEY" ]; then
    echo "Error: MISTRAL_API_KEY is not set"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p /app/logs

# Set default APP_URL if not provided
if [ -z "$NEXT_PUBLIC_APP_URL" ]; then
    export NEXT_PUBLIC_APP_URL="http://localhost:3000"
fi

echo "Environment variables configured successfully"
echo "Starting Next.js application..."

# Start the application
exec pnpm start