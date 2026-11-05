# Backend Dockerfile - Multi-stage build
# Build from the repository root (the backend imports ../shared):
#   docker build -f backend/Dockerfile -t chalice-backend .
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (cached layer)
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci

# Copy sources (shared game logic lives next to backend/)
WORKDIR /app
COPY shared/ ./shared/
COPY backend/tsconfig.json ./backend/
COPY backend/src ./backend/src

# Build TypeScript -> /app/backend/dist/{backend,shared}
WORKDIR /app/backend
RUN npm run build

# Production stage
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Install production dependencies only
COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/backend/dist ./dist

# Logs directory owned by the unprivileged built-in "node" user
RUN mkdir -p logs && chown -R node:node logs

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

CMD ["node", "dist/backend/src/index.js"]
