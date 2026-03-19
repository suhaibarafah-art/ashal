FROM n8nio/n8n:latest

USER root

# Install additional tools needed by custom nodes
RUN apk add --no-cache \
    curl \
    jq \
    tzdata

# Set timezone to Riyadh
ENV TZ=Asia/Riyadh

# Create data directory with proper permissions
RUN mkdir -p /home/node/.n8n && \
    chown -R node:node /home/node/.n8n

USER node

WORKDIR /home/node

# Expose n8n default port
EXPOSE 5678

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5678/healthz || exit 1

CMD ["n8n", "start"]
