const serverless = require("serverless-http");
const express = require("express");

const logging = require('../../middleware/logging');
const customers = require('../../lib/customers');

const app = express();
app.use(express.json());
app.use(logging);

// add a router for the base path so we don't have to keep repeating it
const router = express.Router();
app.use('/customers', router);

router.get("/", (req, res) => {
  const records = customers.get();

  return res
    .status(200).json(records);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const customer = customers.get().find(c => c.id === id);

  if (!customer) {
    return res.status(404).send();
  }

  return res
    .status(200)
    .json(customer);
});

router.post("/", (req, res) => {
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

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const customer = customers.get().find(c => c.id === id);

  if (!customer) {
    return res.status(404).send();
  }

  customers.remove({ id: customer.id });

  return res.status(204).send();
});

router.use("/", require('../../middleware/404'));

module.exports = {
  app,
  handler: serverless(app)
}
