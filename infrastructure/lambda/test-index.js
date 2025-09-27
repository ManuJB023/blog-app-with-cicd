exports.handler = async (event) => {
    console.log('Event received:', JSON.stringify(event, null, 2));
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            message: 'Hello from Lambda!',
            path: event.path,
            method: event.httpMethod,
            env: {
                tableName: process.env.POSTS_TABLE_NAME,
                nodeEnv: process.env.NODE_ENV
            }
        })
    };
};
