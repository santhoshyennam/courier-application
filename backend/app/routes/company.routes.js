module.exports = (app) => {
  const Company = require("../controllers/company.controller.js");
  var router = require("express").Router();
  const { authenticateRoute } = require("../authentication/authentication");

  // Create a new Company
  router.post("/companies/",Company.create);

  // Retrieve all Company
  router.get("/companies/", Company.findAll);

  // Retrieve a single Company with CompanyId
  router.get("/companies/:id", Company.findOne);

  // Update an Company with CompanyId
  router.put("/companies/:id", Company.update);

  // Delete an Company with CompanyId
  router.delete("/companies/:id", Company.delete);

  // Delete all
  router.delete("/companies/", Company.deleteAll);

  app.use(router);
};
