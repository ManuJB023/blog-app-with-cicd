import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class BlogAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
    const postsTable = new dynamodb.Table(this, 'BlogPostsTable', {
      tableName: 'blog-posts',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda function
    const blogApiLambda = new lambda.Function(this, 'BlogApiLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        POSTS_TABLE_NAME: postsTable.tableName,
      },
    });

    postsTable.grantReadWriteData(blogApiLambda);

    // API Gateway
    const api = new apigateway.RestApi(this, 'BlogApi', {
      restApiName: 'Blog API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type'],
      },
    });

    const integration = new apigateway.LambdaIntegration(blogApiLambda);
    const posts = api.root.addResource('posts');
    posts.addMethod('GET', integration);
    posts.addMethod('POST', integration);
    
    const singlePost = posts.addResource('{id}');
    singlePost.addMethod('GET', integration);
    singlePost.addMethod('DELETE', integration);

    // S3 bucket for frontend - fixed configuration
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: `blog-app-frontend-${cdk.Aws.ACCOUNT_ID}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiURL', { value: api.url });
    new cdk.CfnOutput(this, 'BucketName', { value: websiteBucket.bucketName });
    new cdk.CfnOutput(this, 'WebsiteURL', { value: websiteBucket.bucketWebsiteUrl });
  }
}
