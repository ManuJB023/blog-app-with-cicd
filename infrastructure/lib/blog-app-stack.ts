import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';

export class BlogAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Get environment name from the stack name
    const envName = id.includes('-') ? id.split('-')[1] : 'dev';
    const stackName = this.stackName.toLowerCase();

    // S3 bucket for hosting frontend
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: `${stackName}-website-${this.account}`,
      versioned: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFront OAI (Origin Access Identity)
    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI');
    websiteBucket.grantRead(oai);

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'BlogDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket, { originAccessIdentity: oai }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(0),
        },
      ],
    });

    // DynamoDB table for blog posts
    const postsTable = new dynamodb.Table(this, 'PostsTable', {
      tableName: `${stackName}-posts-${envName}`,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda backend
    const blogLambda = new lambda.Function(this, 'BlogLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        POSTS_TABLE_NAME: postsTable.tableName,
        NODE_ENV: envName,
      },
    });

    // Grant Lambda permissions to access DynamoDB
    postsTable.grantFullAccess(blogLambda);

    // API Gateway
    const api = new apigateway.RestApi(this, 'BlogApi', {
      restApiName: `${stackName}-api-${envName}`,
      deployOptions: {
        stageName: 'prod',
      },
      // Enable CORS at the API level
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    const blogResource = api.root.addResource('blog');
    blogResource.addMethod('GET', new apigateway.LambdaIntegration(blogLambda));
    blogResource.addMethod('POST', new apigateway.LambdaIntegration(blogLambda));

    // Add methods for individual blog posts
    const blogItemResource = blogResource.addResource('{id}');
    blogItemResource.addMethod('GET', new apigateway.LambdaIntegration(blogLambda));
    blogItemResource.addMethod('PUT', new apigateway.LambdaIntegration(blogLambda));
    blogItemResource.addMethod('DELETE', new apigateway.LambdaIntegration(blogLambda));

    // Create config file for frontend with dynamic values
    const configContent = JSON.stringify({
      apiUrl: api.url,
      region: this.region,
      environment: envName,
    }, null, 2);

    // Deploy config as part of the S3 assets
    const configAsset = s3deploy.Source.data('config.json', configContent);

    // Deploy frontend build to S3
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, '../../frontend/build')),
        configAsset,
      ],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', { 
      value: api.url,
      description: 'Blog API endpoint',
      exportName: `${stackName}-api-url-${envName}`,
    });
    
    new cdk.CfnOutput(this, 'CloudFrontURL', { 
      value: distribution.domainName,
      description: 'CloudFront distribution URL',
    });
    
    new cdk.CfnOutput(this, 'FrontendBucketName', { 
      value: websiteBucket.bucketName,
      description: 'S3 bucket for frontend assets',
    });
    
    new cdk.CfnOutput(this, 'PostsTableName', { 
      value: postsTable.tableName,
      description: 'DynamoDB table for blog posts',
    });
  }
}