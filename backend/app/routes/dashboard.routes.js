module.exports = (app) => {
    const Dashboard = require("../controllers/dashboard.controller.js");
    var router = require("express").Router();
    router.get("/dashboard/", Dashboard.getDashboard);
    app.use(router);
}