exports.handler = async (event, context) => {
    console.log('=== LAMBDA START ===');
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            success: true,
            message: 'Lambda is working!',
            path: event.path,
            method: event.httpMethod,
            tableName: process.env.POSTS_TABLE_NAME
        })
    };
    
    console.log('Response:', JSON.stringify(response, null, 2));
    console.log('=== LAMBDA END ===');
    
    return response;
};