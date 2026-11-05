#!/bin/bash
# Initial EC2 setup script for backend deployment using pre-built images

set -e

echo "🚀 Chalice of the King - Backend EC2 Setup"
echo "=========================================="
echo ""

# Auto-detect EC2 Public IP
echo "Detecting EC2 Public IP..."
EC2_IP=$(curl -s http://checkip.amazonaws.com || curl -s ifconfig.me || echo "localhost")
echo "✓ Detected IP: ${EC2_IP}"
echo ""

# Prompt for credentials
echo "Please provide the following values:"
echo ""

read -p "Enter your GitHub Username (default: shanmuckh): " GITHUB_USER
GITHUB_USER=${GITHUB_USER:-shanmuckh}
# Force lowercase for GHCR
GITHUB_USER=$(echo "$GITHUB_USER" | tr '[:upper:]' '[:lower:]')
read -s -p "Enter your GitHub Personal Access Token: " GITHUB_TOKEN
echo ""
read -p "Enter your Frontend URL for CORS (e.g., https://your-app.vercel.app): " FRONTEND_URL
FRONTEND_URL=${FRONTEND_URL:-http://localhost:5173}
read -p "Enter the public backend domain (e.g., api.example.com): " DOMAIN
DOMAIN=${DOMAIN:-localhost}
echo ""

echo ""

# Create .env file
umask 077
cat > .env << EOF
# Application Configuration
NODE_ENV=production
PORT=3001
LOG_LEVEL=info

# CORS Configuration
FRONTEND_URL=${FRONTEND_URL}
DOMAIN=${DOMAIN}

# Redis Configuration
REDIS_URL=redis://redis:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=1000
RATE_LIMIT_MAX_REQUESTS=5

# WebRTC SFU Configuration (Phase 4)
SFU_PROVIDER=mock
SFU_ROOM_TTL=0

# GitHub Username for pulling images
GITHUB_USER=${GITHUB_USER}
EOF

echo "✅ Created .env file"
echo ""

# Display configuration
echo "📋 Configuration Summary:"
echo "-------------------------"
echo "EC2 IP: ${EC2_IP}"
echo "Backend Domain: ${DOMAIN}"
echo "Backend API: https://${DOMAIN}"
echo ""

# Save credentials (informational)
cat > ~/deployment-credentials.txt << EOF
Chalice of the King - Deployment Credentials
======================================
Generated on: $(date)

EC2 Public IP: ${EC2_IP}
Backend Domain: ${DOMAIN}

Backend API: https://${DOMAIN}

Deploy frontend with:
VITE_SOCKET_URL=https://${DOMAIN}

IMPORTANT: Keep this file secure and delete after saving credentials elsewhere!
EOF

chmod 600 ~/deployment-credentials.txt
echo "💾 Credentials saved to: ~/deployment-credentials.txt"
echo "⚠️  IMPORTANT: Save these credentials securely, then delete the file!"
echo ""

# Ask to deploy
read -p "Start deployment now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting deployment..."
    echo ""
    
    COMPOSE="docker compose -f docker-compose.backend.yml"

    # Login to GitHub Container Registry
    echo "🔐 Logging into GitHub Container Registry..."
    echo "${GITHUB_TOKEN}" | docker login ghcr.io -u "${GITHUB_USER}" --password-stdin
    
    # Pull images
    echo "📦 Pulling Docker images from GHCR..."
    $COMPOSE pull
    
    # Start services
    echo "▶️  Starting services..."
    $COMPOSE up -d
    
    echo ""
    echo "⏳ Waiting for services to start..."
    sleep 10
    
    # Show status
    echo ""
    echo "📊 Service Status:"
    $COMPOSE ps
    
    echo ""
    echo "📋 Recent Logs:"
    $COMPOSE logs --tail=30
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "🌐 Access your backend:"
    echo "   API Base: https://${DOMAIN}"
    echo "   (Initial access: http://${EC2_IP} - will redirect to HTTPS once SSL is active)"
    echo ""
    echo "⚠️  IMPORTANT: Point ${DOMAIN} to ${EC2_IP}"
    echo "   Caddy will automatically obtain an SSL certificate for public DNS names."
    echo ""
    echo "📝 View logs: docker compose -f docker-compose.backend.yml logs -f"
    echo "🔄 Restart: docker compose -f docker-compose.backend.yml restart"
    echo "🛑 Stop: docker compose -f docker-compose.backend.yml down"
    echo ""
else
    echo ""
    echo "Deployment skipped. To deploy manually later:"
    echo "  echo 'YOUR_TOKEN' | docker login ghcr.io -u '${GITHUB_USER}' --password-stdin"
    echo "  docker compose -f docker-compose.backend.yml pull"
    echo "  docker compose -f docker-compose.backend.yml up -d"
fi

echo ""
echo "🎉 Setup complete!"
