// infrastructure/lambda/index.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.POSTS_TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
  };

  try {
    const { httpMethod, pathParameters, body } = event;
    const path = event.resource;

    switch (httpMethod) {
      case 'GET':
        if (path === '/posts') {
          return await getAllPosts(headers);
        } else if (path === '/posts/{id}') {
          return await getPost(pathParameters?.id!, headers);
        }
        break;

      case 'POST':
        if (path === '/posts') {
          return await createPost(body!, headers);
        }
        break;

      case 'PUT':
        if (path === '/posts/{id}') {
          return await updatePost(pathParameters?.id!, body!, headers);
        }
        break;

      case 'DELETE':
        if (path === '/posts/{id}') {
          return await deletePost(pathParameters?.id!, headers);
        }
        break;

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

async function getAllPosts(headers: any): Promise<APIGatewayProxyResult> {
  const command = new ScanCommand({
    TableName: tableName,
  });

  const result = await ddbDocClient.send(command);
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Items || []),
  };
}

async function getPost(id: string, headers: any): Promise<APIGatewayProxyResult> {
  const command = new GetCommand({
    TableName: tableName,
    Key: { id },
  });

  const result = await ddbDocClient.send(command);
  
  if (!result.Item) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Post not found' }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Item),
  };
}

async function createPost(body: string, headers: any): Promise<APIGatewayProxyResult> {
  const data = JSON.parse(body);
  const post = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const command = new PutCommand({
    TableName: tableName,
    Item: post,
  });

  await ddbDocClient.send(command);

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(post),
  };
}

async function updatePost(id: string, body: string, headers: any): Promise<APIGatewayProxyResult> {
  const data = JSON.parse(body);
  
  const command = new UpdateCommand({
    TableName: tableName,
    Key: { id },
    UpdateExpression: 'SET #title = :title, #content = :content, #author = :author, tags = :tags, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#title': 'title',
      '#content': 'content',
      '#author': 'author',
    },
    ExpressionAttributeValues: {
      ':title': data.title,
      ':content': data.content,
      ':author': data.author,
      ':tags': data.tags,
      ':updatedAt': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  });

  const result = await ddbDocClient.send(command);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Attributes),
  };
}

async function deletePost(id: string, headers: any): Promise<APIGatewayProxyResult> {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: { id },
  });

  await ddbDocClient.send(command);

  return {
    statusCode: 204,
    headers,
    body: '',
  };
}