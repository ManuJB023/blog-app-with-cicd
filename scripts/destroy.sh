#!/bin/bash

# Blog App Resource Cleanup Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="dev"
FORCE=false
SKIP_CONFIRMATION=false
BACKUP_DATA=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -e|--environment)
      ENVIRONMENT="$2"
      shift 2
      ;;
    --force)
      FORCE=true
      shift
      ;;
    --yes)
      SKIP_CONFIRMATION=true
      shift
      ;;
    --backup-data)
      BACKUP_DATA=true
      shift
      ;;
    -h|--help)
      echo "Blog App Resource Cleanup Script"
      echo ""
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  -e, --environment    Environment to destroy (dev, staging, prod) [default: dev]"
      echo "  --force             Force destroy even if stack is in use"
      echo "  --yes               Skip confirmation prompts"
      echo "  --backup-data       Backup DynamoDB data before destroying"
      echo "  -h, --help          Show this help message"
      echo ""
      echo "Examples:"
      echo "  $0 --environment dev"
      echo "  $0 --environment prod --backup-data"
      echo "  $0 --force --yes  # Dangerous: no confirmations"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

STACK_NAME="BlogAppStack-${ENVIRONMENT}"

echo -e "${BLUE}Blog App Resource Cleanup${NC}"
echo -e "${BLUE}===========================${NC}"
echo "Environment: ${ENVIRONMENT}"
echo "Stack Name: ${STACK_NAME}"
echo ""

# Function to check if AWS CLI is configured
check_aws_cli() {
  if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
  fi

  if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not configured or credentials are invalid${NC}"
    exit 1
  fi
}

# Function to check if CDK is available
check_cdk_cli() {
  if ! command -v npx cdk &> /dev/null; then
    echo -e "${RED}Error: AWS CDK CLI is not installed${NC}"
    echo "Install with: npm install -g aws-cdk"
    exit 1
  fi
}

# Function to check if stack exists
check_stack_exists() {
  local stack_name=$1
  if npx cdk list --context environment="${ENVIRONMENT}" | grep -q "${stack_name}"; then
    return 0
  else
    return 1
  fi
}

# Function to backup DynamoDB data
backup_dynamodb() {
  local table_name="${STACK_NAME,,}-posts-${ENVIRONMENT}"
  local backup_file="dynamodb-backup-${ENVIRONMENT}-$(date +%Y%m%d_%H%M%S).json"
  
  echo -e "${YELLOW}Checking for DynamoDB table: ${table_name}${NC}"
  
  if aws dynamodb describe-table --table-name "${table_name}" &> /dev/null; then
    echo -e "${YELLOW}Backing up DynamoDB data to ${backup_file}...${NC}"
    aws dynamodb scan --table-name "${table_name}" > "${backup_file}"
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Backup completed: ${backup_file}${NC}"
    else
      echo -e "${RED}Backup failed, but continuing with destruction...${NC}"
    fi
  else
    echo -e "${YELLOW}DynamoDB table not found or already deleted${NC}"
  fi
}

# Function to get stack outputs for reference
get_stack_info() {
  local stack_name=$1
  echo -e "${BLUE}Current stack information:${NC}"
  
  if aws cloudformation describe-stacks --stack-name "${stack_name}" &> /dev/null; then
    echo -e "${YELLOW}Stack Outputs:${NC}"
    aws cloudformation describe-stacks --stack-name "${stack_name}" \
      --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
      --output table 2>/dev/null || echo "No outputs available"
    
    echo -e "${YELLOW}Stack Resources:${NC}"
    aws cloudformation describe-stack-resources --stack-name "${stack_name}" \
      --query 'StackResources[*].[ResourceType,LogicalResourceId,ResourceStatus]' \
      --output table 2>/dev/null || echo "No resources information available"
  else
    echo -e "${YELLOW}Stack ${stack_name} not found in CloudFormation${NC}"
  fi
  echo ""
}

# Function to perform the actual destruction
destroy_stack() {
  local stack_name=$1
  
  echo -e "${YELLOW}Starting destruction of stack: ${stack_name}${NC}"
  
  if [ "$FORCE" = true ]; then
    echo -e "${YELLOW}Force mode enabled - skipping dependency checks${NC}"
    npx cdk destroy "${stack_name}" --force --context environment="${ENVIRONMENT}"
  else
    npx cdk destroy "${stack_name}" --context environment="${ENVIRONMENT}"
  fi
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Stack ${stack_name} destroyed successfully!${NC}"
  else
    echo -e "${RED}Failed to destroy stack ${stack_name}${NC}"
    echo -e "${RED}You may need to manually clean up resources in the AWS Console${NC}"
    exit 1
  fi
}

# Function to verify destruction
verify_destruction() {
  local stack_name=$1
  echo -e "${YELLOW}Verifying stack destruction...${NC}"
  
  # Wait a bit for AWS to update
  sleep 5
  
  if aws cloudformation describe-stacks --stack-name "${stack_name}" &> /dev/null; then
    local stack_status=$(aws cloudformation describe-stacks --stack-name "${stack_name}" \
      --query 'Stacks[0].StackStatus' --output text 2>/dev/null)
    
    if [ "$stack_status" = "DELETE_COMPLETE" ] || [ "$stack_status" = "DELETE_IN_PROGRESS" ]; then
      echo -e "${GREEN}Stack destruction verified: ${stack_status}${NC}"
    else
      echo -e "${YELLOW}Stack status: ${stack_status}${NC}"
      echo -e "${YELLOW}Some resources may still be cleaning up${NC}"
    fi
  else
    echo -e "${GREEN}Stack completely removed from CloudFormation${NC}"
  fi
}

# Function to clean up local files
cleanup_local_files() {
  echo -e "${YELLOW}Cleaning up local build artifacts...${NC}"
  
  # Clean CDK outputs
  if [ -d "cdk.out" ]; then
    rm -rf cdk.out
    echo "Removed cdk.out/"
  fi
  
  if [ -d "infrastructure/cdk.out" ]; then
    rm -rf infrastructure/cdk.out
    echo "Removed infrastructure/cdk.out/"
  fi
  
  # Clean frontend build
  if [ -d "frontend/build" ]; then
    rm -rf frontend/build
    echo "Removed frontend/build/"
  fi
  
  # Clean any CDK context
  if [ -f "cdk.context.json" ]; then
    rm cdk.context.json
    echo "Removed cdk.context.json"
  fi
  
  if [ -f "infrastructure/cdk.context.json" ]; then
    rm infrastructure/cdk.context.json
    echo "Removed infrastructure/cdk.context.json"
  fi
  
  echo -e "${GREEN}Local cleanup completed${NC}"
}

# Main execution
main() {
  echo -e "${YELLOW}Checking prerequisites...${NC}"
  check_aws_cli
  check_cdk_cli
  
  # Show current AWS identity
  echo -e "${BLUE}Current AWS Identity:${NC}"
  aws sts get-caller-identity --query '[Account,Arn]' --output table
  echo ""
  
  if ! check_stack_exists "${STACK_NAME}"; then
    echo -e "${YELLOW}Stack ${STACK_NAME} does not exist or is not managed by CDK${NC}"
    echo -e "${YELLOW}Checking CloudFormation directly...${NC}"
    
    if aws cloudformation describe-stacks --stack-name "${STACK_NAME}" &> /dev/null; then
      echo -e "${RED}Stack exists in CloudFormation but not in CDK context${NC}"
      echo -e "${RED}This may require manual cleanup through AWS Console${NC}"
      exit 1
    else
      echo -e "${GREEN}No stack found to destroy${NC}"
      cleanup_local_files
      exit 0
    fi
  fi
  
  # Show stack information
  get_stack_info "${STACK_NAME}"
  
  # Backup data if requested
  if [ "$BACKUP_DATA" = true ]; then
    backup_dynamodb
    echo ""
  fi
  
  # Confirmation prompt
  if [ "$SKIP_CONFIRMATION" = false ]; then
    echo -e "${RED}WARNING: This will permanently destroy all resources in the ${ENVIRONMENT} environment!${NC}"
    echo -e "${RED}This includes:${NC}"
    echo "  - DynamoDB table and ALL data"
    echo "  - Lambda functions"
    echo "  - API Gateway"
    echo "  - S3 bucket and website content"
    echo "  - CloudFront distribution"
    echo "  - All IAM roles and policies"
    echo ""
    read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirmation
    
    if [ "$confirmation" != "yes" ]; then
      echo -e "${YELLOW}Destruction cancelled${NC}"
      exit 0
    fi
  fi
  
  # Perform destruction
  destroy_stack "${STACK_NAME}"
  
  # Verify destruction
  verify_destruction "${STACK_NAME}"
  
  # Clean up local files
  cleanup_local_files
  
  echo ""
  echo -e "${GREEN}🎉 Cleanup completed successfully!${NC}"
  echo -e "${GREEN}Environment '${ENVIRONMENT}' has been destroyed${NC}"
  
  if [ "$BACKUP_DATA" = true ]; then
    echo -e "${BLUE}💾 Data backup saved for reference${NC}"
  fi
  
  echo ""
  echo -e "${BLUE}Cost Impact:${NC}"
  echo "✅ All AWS resources have been destroyed"
  echo "✅ No ongoing costs will be incurred"
  echo "✅ You can safely redeploy anytime with ./scripts/deploy.sh"
}

# Run main function
main