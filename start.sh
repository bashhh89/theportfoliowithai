#!/bin/bash

# Start script for deployment
echo "Starting Living Portfolio with AI..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Set default values for optional environment variables
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-3000}

# Set default APP_URL if not provided
if [ -z "$NEXT_PUBLIC_APP_URL" ]; then
    export NEXT_PUBLIC_APP_URL="http://localhost:$PORT"
fi

# Check if required environment variables are set (warn but don't exit)
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "Warning: NEXT_PUBLIC_SUPABASE_URL is not set - some features may not work"
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set - some features may not work"
fi

if [ -z "$MISTRAL_API_KEY" ]; then
    echo "Warning: MISTRAL_API_KEY is not set - AI chat will not work"
fi

echo "Environment configured successfully"
echo "Starting Next.js application on port $PORT..."

# Start the application
exec pnpm start