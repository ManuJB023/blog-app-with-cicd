exports.handler = async (event, context) => {
    console.log('=== DIAGNOSTIC LAMBDA START ===');
    console.log('Event:', JSON.stringify(event, null, 2));
    console.log('Context:', JSON.stringify(context, null, 2));
    console.log('Environment:', JSON.stringify(process.env, null, 2));
    
    try {
        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                message: 'Lambda is working!',
                event: event,
                environment: {
                    NODE_ENV: process.env.NODE_ENV,
                    POSTS_TABLE_NAME: process.env.POSTS_TABLE_NAME,
                    AWS_REGION: process.env.AWS_REGION
                },
                requestInfo: {
                    path: event.path,
                    httpMethod: event.httpMethod,
                    resource: event.resource,
                    requestContext: event.requestContext
                }
            }, null, 2)
        };
        
        console.log('Response:', JSON.stringify(response, null, 2));
        console.log('=== DIAGNOSTIC LAMBDA END ===');
        
        return response;
        
    } catch (error) {
        console.error('Error in diagnostic function:', error);
        console.log('=== DIAGNOSTIC LAMBDA ERROR ===');
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Diagnostic function failed',
                details: error.message,
                stack: error.stack
            })
        };
    }
};
