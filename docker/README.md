# Docker Configuration

This directory contains all Docker-related configurations for the project.

## Directory Structure

```
docker/
├── Dockerfile             # Multi-stage Dockerfile for development and production
├── docker-compose.yml     # Base Docker Compose configuration
├── docker-compose.dev.yml # Development-specific overrides
├── docker-compose.prod.yml# Production-specific overrides
└── scripts/
    └── docker-entrypoint.sh # Entrypoint script for container initialization
```

## Usage

### Development

```bash
# Start development environment
pnpm docker:dev

# Rebuild and start development environment
pnpm docker:dev:build
```

### Production

```bash
# Start production environment
pnpm docker:prod

# Rebuild and start production environment
pnpm docker:prod:build
```

### Environment Variables

Make sure to create a `.env` file in the project root with the necessary environment variables:

```env
REDIS_HOST=redis
REDIS_PORT=6379
# ... other environment variables
```