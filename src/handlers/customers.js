const serverless = require("serverless-http");
const express = require("express");
const customers = require('../lib/customers');

const app = express();

app.get("/customers", (req, res) => {
  return res
    .status(200).json(customers.get());
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
