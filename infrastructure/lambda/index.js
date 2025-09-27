"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuid } = require("uuid");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.POSTS_TABLE_NAME;

const handler = async (event) => {
    // Enhanced logging for debugging
    console.log('Full event received:', JSON.stringify(event, null, 2));
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
    };

    try {
        const { httpMethod, pathParameters, body } = event;
        
        // Handle different API Gateway event formats
        let path;
        let method;
        
        // Check if it's API Gateway v2.0 (HTTP API) format
        if (event.requestContext && event.requestContext.http) {
            path = event.requestContext.http.path;
            method = event.requestContext.http.method;
            console.log('HTTP API v2.0 detected');
        }
        // Check if it's API Gateway v1.0 (REST API) format
        else if (event.requestContext && event.requestContext.httpMethod) {
            // For REST API, use resource path with path parameters resolved
            path = event.path || event.requestContext.path;
            method = event.httpMethod || event.requestContext.httpMethod;
            console.log('REST API v1.0 detected');
        }
        // Direct Lambda invocation or other format
        else {
            path = event.path;
            method = event.httpMethod;
            console.log('Direct invocation or other format detected');
        }

        console.log('Processed request:', { method, path, pathParameters });

        // Handle CORS preflight requests first
        if (method === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: '',
            };
        }

        // Route the requests - UPDATED TO HANDLE /blog ENDPOINT
        switch (method) {
            case 'GET':
                // Handle both /posts and /blog endpoints for backward compatibility
                if (path === '/blog' || path === '/blog/' || path === '/prod/blog' || 
                    path === '/posts' || path === '/posts/' || path === '/prod/posts') {
                    return await getAllPosts(headers);
                } else if (pathParameters && pathParameters.id) {
                    // Use path parameters if available (better for REST API)
                    return await getPost(pathParameters.id, headers);
                } else if ((path.includes('/blog/') && path.split('/blog/')[1]) || 
                          (path.includes('/posts/') && path.split('/posts/')[1])) {
                    // Fallback to path parsing for both endpoints
                    const id = path.includes('/blog/') ? path.split('/blog/')[1] : path.split('/posts/')[1];
                    return await getPost(id, headers);
                }
                break;

            case 'POST':
                // Handle both /posts and /blog endpoints for backward compatibility
                if (path === '/blog' || path === '/blog/' || path === '/prod/blog' ||
                    path === '/posts' || path === '/posts/' || path === '/prod/posts') {
                    return await createPost(body, headers);
                }
                break;

            case 'PUT':
                if (pathParameters && pathParameters.id) {
                    return await updatePost(pathParameters.id, body, headers);
                } else if ((path.includes('/blog/') && path.split('/blog/')[1]) ||
                          (path.includes('/posts/') && path.split('/posts/')[1])) {
                    const id = path.includes('/blog/') ? path.split('/blog/')[1] : path.split('/posts/')[1];
                    return await updatePost(id, body, headers);
                }
                break;

            case 'DELETE':
                if (pathParameters && pathParameters.id) {
                    return await deletePost(pathParameters.id, headers);
                } else if ((path.includes('/blog/') && path.split('/blog/')[1]) ||
                          (path.includes('/posts/') && path.split('/posts/')[1])) {
                    const id = path.includes('/blog/') ? path.split('/blog/')[1] : path.split('/posts/')[1];
                    return await deletePost(id, headers);
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
            body: JSON.stringify({ error: 'Not found', path, method }),
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error', 
                details: error.message,
                tableName: tableName // Add this for debugging
            }),
        };
    }
};

exports.handler = handler;

async function getAllPosts(headers) {
    try {
        console.log('Getting all posts from table:', tableName);
        
        if (!tableName) {
            throw new Error('POSTS_TABLE_NAME environment variable is not set');
        }

        const command = new ScanCommand({
            TableName: tableName,
        });
        
        const result = await ddbDocClient.send(command);
        console.log('Scan result:', result);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result.Items || []),
        };
    } catch (error) {
        console.error('Error getting all posts:', error);
        throw error;
    }
}

async function getPost(id, headers) {
    try {
        console.log('Getting post with id:', id);
        
        if (!tableName) {
            throw new Error('POSTS_TABLE_NAME environment variable is not set');
        }

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
    } catch (error) {
        console.error('Error getting post:', error);
        throw error;
    }
}

async function createPost(body, headers) {
    try {
        console.log('Creating post with body:', body);
        
        if (!tableName) {
            throw new Error('POSTS_TABLE_NAME environment variable is not set');
        }

        const data = JSON.parse(body || '{}');
        const post = {
            id: uuid(),
            title: data.title || 'Untitled',
            content: data.content || '',
            author: data.author || 'Anonymous',
            tags: data.tags || [],
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
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

async function updatePost(id, body, headers) {
    try {
        console.log('Updating post with id:', id, 'and body:', body);
        
        if (!tableName) {
            throw new Error('POSTS_TABLE_NAME environment variable is not set');
        }

        const data = JSON.parse(body || '{}');
        
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
                ':title': data.title || 'Untitled',
                ':content': data.content || '',
                ':author': data.author || 'Anonymous',
                ':tags': data.tags || [],
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
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
}

async function deletePost(id, headers) {
    try {
        console.log('Deleting post with id:', id);
        
        if (!tableName) {
            throw new Error('POSTS_TABLE_NAME environment variable is not set');
        }

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
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}