#!/bin/bash

# Blog App Deployment Script
set -e

# Default values
ENVIRONMENT="dev"
SKIP_BUILD=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -e|--environment)
      ENVIRONMENT="$2"
      shift 2
      ;;
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  -e, --environment    Environment to deploy to (dev, staging, prod) [default: dev]"
      echo "  --skip-build        Skip frontend build step"
      echo "  -h, --help          Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

echo "Deploying Blog App to environment: $ENVIRONMENT"

# Install dependencies
echo "Installing dependencies..."
if [ ! -d "node_modules" ]; then
  npm install
fi

if [ ! -d "frontend/node_modules" ]; then
  cd frontend && npm install && cd ..
fi

if [ ! -d "infrastructure/node_modules" ]; then
  cd infrastructure && npm install && cd ..
fi

# Build frontend
if [ "$SKIP_BUILD" = false ]; then
  echo "Building frontend..."
  cd frontend
  NODE_OPTIONS="--max-old-space-size=4096" npm run build
  cd ..
fi

# Deploy CDK stack
echo "Deploying CDK stack..."
cdk deploy --context environment="$ENVIRONMENT" --require-approval never

echo "Deployment completed successfully!"
echo "Check the CDK outputs for your application URLs."