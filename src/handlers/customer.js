const serverless = require("serverless-http");
const express = require("express");
const customers = require('../lib/customers');

const app = express();

app.get("/", (req, res) => {
  return res
    .status(200)
    .json(customers.get());
});

app.get("/:id", (req, res) => {
  const { id } = req.params;

  const customer = customers.get().find(c => c.id === id);

  if (!customer) {
    return res.status(404);
  }

  return res
    .status(200)
    .json(customer);
});

app.post("/", (req, res) => {
  const { id, name, address } = req.body;

  const isValidCustomer = id && name && address;

  if (!isValidCustomer) {
    return res.status(400);
  };

  customers.add({ 
    customer: { id, name, address }
  });

  return res.status(201);
});

app.delete("/:id", (req, res) => {
  const { id } = req.params;

  const customer = customers.get().find(c => c.id === id);

  if (!customer) {
    return res.status(404);
  }

  customers.remove(customer.id);

  return res.status(204);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
