const { pick } = require('lodash');

module.exports = (req, res, next) => {
  const start = Date.now();

  const { apiGateway } = req;

  let request;
  
  // if the request doesn't have an apiGateway property, we're running locally or testing and the request will have a different shape.
  if (!!apiGateway) { 
    const { event } = apiGateway;
    request = pick(event, ['headers', 'httpMethod', 'path', 'pathParameters', 'queryStringParameters', 'requestContext', 'resource', 'stageVariables']);
  } else {
    request = pick(req, ['headers', 'method', 'url', 'params', 'query']);
  }
    
  next();

  const { statusCode, statusMessage, _header: headers } = res;
  const duration = Date.now() - start;
  
  console.log(JSON.stringify({
    request,
    response: {
      statusCode, 
      statusMessage, 
      headers
    },
    duration
  }));
}