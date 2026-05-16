# Multi-stage optimized Dockerfile for ExecuteOJ Backend
# Stage 1: Build and runtime environment
FROM node:18-alpine

WORKDIR /app

# Combine package updates, dependency installation, and cache cleanup
# in a single RUN command to minimize layer count and image size
RUN apk update && apk add --no-cache python3 g++ && \
    rm -rf /var/cache/apk/*

# Copy only package files first for better layer caching
# This ensures dependencies are re-installed only when package*.json changes
COPY package*.json ./

# Install production dependencies only to reduce image size
# npm ci ensures deterministic, repeatable installs (better than npm install)
RUN npm ci --only=production

# Copy rest of application code
COPY . .

EXPOSE 5000

# Health check to monitor container status
# Attempts to access the root endpoint every 30 seconds
# Container marked unhealthy if check fails 3+ times
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:5000/ || exit 1

CMD ["node", "index.js"]