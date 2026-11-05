# Frontend Dockerfile - Multi-stage build
# Build from the repository root (the frontend imports ../shared):
#   docker build -f frontend/Dockerfile --build-arg VITE_SOCKET_URL=http://localhost:3001 -t chalice-frontend .
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (cached layer)
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci

# Copy sources
WORKDIR /app
COPY shared/ ./shared/
COPY frontend/ ./frontend/

# Build the application (VITE_* vars are baked in at build time)
WORKDIR /app/frontend
ARG VITE_SOCKET_URL
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

COPY frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
