module.exports = (app) => {
  const Customer = require("../controllers/customer.controller.js");
  var router = require("express").Router();

  // Create a new Customer
  router.post("/customers/",  Customer.create);

  // Retrieve all customers
  router.get("/customers/", Customer.findAll);

  // Retrieve a single Customer with id
  router.get("/customers/:id", Customer.findOne);

  // Update a Customer with id
  router.put("/customers/:id", Customer.update);

  // Delete a Customer with id
  router.delete("/customers/:id",Customer.delete);

  // Delete all customers
  router.delete("/customers/", Customer.deleteAll);

  app.use(router);
};
