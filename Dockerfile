# Use Node.js 18 LTS
FROM node:18-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (including dev dependencies)
RUN pnpm install --frozen-lockfile --prod=false

# Copy source code
COPY . .

# Create non-root user for security
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Set environment for development
ENV NODE_ENV=development
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start in development mode (no build required)
CMD ["pnpm", "dev"]