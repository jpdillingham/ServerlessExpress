const { omit, pick } = require('lodash');
const serverless = require("serverless-http");
const { metricScope } = require("aws-embedded-metrics");
const express = require("express");

const customers = require('../lib/customers');

const app = express();
app.use(express.json());

app.use(metricScope(metrics => async (req, res, next) => {
  const start = Date.now();

  metrics.setNamespace("ServerlessExpress");
  metrics.setProperty("Path", req.path);
  metrics.setProperty("Method", req.method);
  metrics.setProperty("RequestId", req.headers["x-request-id"])
  req['metrics'] = metrics;
  
  const { apiGateway: { event }} = req;
  const { headers: requestHeaders, httpMethod, path, pathParameters, queryStringParameters, requestContext, resource, stageVariables } = event;
  
  next();

  const { statusCode, statusMessage, _header: responseHeaders } = res;
  const duration = Date.now() - start;
  
  console.log(JSON.stringify({
    request: {
      httpMethod, 
      path,
      pathParameters, 
      queryStringParameters, 
      requestHeaders, 
      context: {
        requestContext, 
        resource, 
        stageVariables
      }
    },
    response: {
      statusCode, 
      statusMessage, 
      responseHeaders
    },
    duration
  }));

  req.metrics.putMetric("HandlerTime", duration);
}));

app.get("/customers", (req, res) => {
  const records = customers.get();

  req.metrics.putMetric("CustomerCount", (records || []).length);

  return res
    .status(200).json(records);
});

app.get("/customers/:id", (req, res) => {
  const { id } = req.params;

  const customer = customers.get().find(c => c.id === id);

  if (!customer) {
    return res.status(404).send();
  }

  return res
    .status(200)
    .json(customer);
});

app.post("/customers", (req, res) => {
  const { id, name, address } = req.body;

  const isValidCustomer = id && name && address;

  if (!isValidCustomer) {
    return res.status(400).send();
  };

  customers.add({ 
    customer: { id, name, address }
  });

  return res.status(201).send();
});

app.delete("/customers/:id", (req, res) => {
  const { id } = req.params;

  const customer = customers.get().find(c => c.id === id);

  if (!customer) {
    return res.status(404).send();
  }

  customers.remove({ id: customer.id });

  return res.status(204).send();
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: `Not Found: ${res.path}`,
  });
});

module.exports.handler = serverless(app);
