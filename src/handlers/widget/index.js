const serverless = require("serverless-http");
const express = require("express");

const logging = require('../../middleware/logging');
const customers = require('../../lib/customers');

const app = express();
app.use(express.json());
app.use(logging);

const router = express.Router();
app.use('/widgets', router);

router.get("/", (req, res) => {
  const records = customers.get();

  return res
    .status(200).json([1,2,3,4,5,6]);
});

router.use("/", require('../../middleware/404'));

module.exports = {
  app,
  handler: serverless(app)
}
