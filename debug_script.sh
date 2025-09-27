# Debug API Gateway Configuration

# 1. List all API Gateways to find the correct name
echo "=== All API Gateways ==="
aws apigateway get-rest-apis --query "items[*].{name:name, id:id, createdDate:createdDate}"

# 2. Check if it might be an HTTP API (v2) instead of REST API (v1)
echo -e "\n=== HTTP APIs (API Gateway v2) ==="
aws apigatewayv2 get-apis --query "Items[*].{name:Name, id:ApiId, protocolType:ProtocolType}"

# 3. Get CloudFormation stack outputs to find the API endpoint
echo -e "\n=== CloudFormation Stack Outputs ==="
aws cloudformation describe-stacks --stack-name BlogAppStack --query "Stacks[0].Outputs[*].{Key:OutputKey, Value:OutputValue}"

# 4. List Lambda functions to verify the function exists
echo -e "\n=== Lambda Functions ==="
aws lambda list-functions --query "Functions[?contains(FunctionName, 'Blog') || contains(FunctionName, 'blog')].{name:FunctionName, runtime:Runtime}"

# 5. Check recent CloudWatch logs for the Lambda function
echo -e "\n=== Recent Lambda Logs ==="
# First, find the log group
LOG_GROUPS=$(aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/" --query "logGroups[?contains(logGroupName, 'Blog') || contains(logGroupName, 'blog')].logGroupName" --output text)

if [ ! -z "$LOG_GROUPS" ]; then
    for LOG_GROUP in $LOG_GROUPS; do
        echo "--- Logs from $LOG_GROUP ---"
        aws logs filter-log-events --log-group-name "$LOG_GROUP" --start-time $(date -d '10 minutes ago' +%s)000 --query "events[*].message" --output text | tail -10
    done
else
    echo "No Lambda log groups found with 'Blog' or 'blog' in the name"
fi