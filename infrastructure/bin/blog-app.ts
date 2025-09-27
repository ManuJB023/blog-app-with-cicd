#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BlogAppStack } from '../lib/blog-app-stack';

const app = new cdk.App();

// Get environment from context or default to 'dev'
const environmentName = app.node.tryGetContext('environment') || 'dev';
const accountId = app.node.tryGetContext('account') || process.env.CDK_DEFAULT_ACCOUNT;
const region = app.node.tryGetContext('region') || process.env.CDK_DEFAULT_REGION;

// Create stack with environment-specific name
new BlogAppStack(app, `BlogAppStack-${environmentName}`, {
  env: {
    account: accountId,
    region: region,
  },
});