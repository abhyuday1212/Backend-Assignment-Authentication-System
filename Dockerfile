# syntax=docker/dockerfile:1

# Stage 1: Build Stage
FROM node:22.13.1-slim AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy source files and build the application
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: Production Stage
FROM node:22.13.1-slim AS production

# Set working directory
WORKDIR /app

# Copy built application and dependencies from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Expose the application port
EXPOSE 8000

# Run the application
CMD ["node", "dist/src/server.js"]