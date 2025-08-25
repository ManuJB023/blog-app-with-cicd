const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.POSTS_TABLE_NAME;

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE',
  };

  try {
    const { httpMethod, pathParameters, body } = event;
    const path = event.resource;
    
    console.log('Method:', httpMethod, 'Path:', path, 'Body:', body);

    // Handle CORS preflight
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'CORS preflight' }),
      };
    }

    switch (httpMethod) {
      case 'GET':
        if (path === '/posts') {
          return await getAllPosts(headers);
        } else if (path === '/posts/{id}') {
          return await getPost(pathParameters?.id, headers);
        }
        break;
      case 'POST':
        if (path === '/posts') {
          return await createPost(body, headers);
        }
        break;
      case 'DELETE':
        if (path === '/posts/{id}') {
          return await deletePost(pathParameters?.id, headers);
        }
        break;
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
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};

async function getAllPosts(headers) {
  console.log('Getting all posts from table:', tableName);
  const command = new ScanCommand({ TableName: tableName });
  const result = await ddbDocClient.send(command);
  console.log('DynamoDB result:', result);
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Items || []),
  };
}

async function getPost(id, headers) {
  console.log('Getting post with id:', id);
  const command = new GetCommand({ TableName: tableName, Key: { id } });
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

async function createPost(body, headers) {
  console.log('Creating post with body:', body);
  const data = JSON.parse(body);
  const post = {
    id: uuidv4(),
    title: data.title || 'Untitled',
    content: data.content || '',
    author: data.author || 'Anonymous',
    tags: data.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log('Inserting post:', post);
  const command = new PutCommand({ TableName: tableName, Item: post });
  await ddbDocClient.send(command);

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(post),
  };
}

async function deletePost(id, headers) {
  console.log('Deleting post with id:', id);
  const command = new DeleteCommand({ TableName: tableName, Key: { id } });
  await ddbDocClient.send(command);

  return {
    statusCode: 204,
    headers,
    body: '',
  };
}
