module.exports = (app) => {
  const Courier = require("../controllers/user.controller.js");
  var router = require("express").Router();

  // Create a new Courier
  router.post("/couriers/",  Courier.create);

  // Retrieve all couriers
  router.get("/couriers/", Courier.findAll);

  // Retrieve a single Courier with id
  router.get("/couriers/:id", Courier.findOne);

  // Update a Courier with id
  router.put("/couriers/:id", Courier.update);

  // Delete a Courier with id
  router.delete("/couriers/:id",Courier.delete);

  // Delete all couriers
  router.delete("/couriers/", Courier.deleteAll);

  app.use(router);
};
