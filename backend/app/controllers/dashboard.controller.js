const db = require("../models");
const DeliveryRequest = db.delivery_request;
const Customer = db.customer;
const User = db.user;
const sequelize = db.sequelize;
const { QueryTypes } = require('sequelize');

exports.getDashboard = async(req, res) => {
    try{
        const employeeCount = await getUsersCount({});
        const adminCount = await getUsersCount({ role_id: 1});
        const clerkCount = await getUsersCount({ role_id: 2});
        const deliveryBoyCount = await getUsersCount({ role_id: 3});
        const customerCount = await getCustomersCount({});
        const pendingRequestCount = await getRequestsCount({ delivery_status: "pending"});
        const progressRequestCount = await getRequestsCount({ delivery_status: "progress"});
        const deliveredRequestCount = await getRequestsCount({ delivery_status: "delivered"});
        const requestCount = pendingRequestCount+progressRequestCount+deliveredRequestCount;
        const deliveryInTimeCount = await getRequestsCount({ deliveredInTime: 1});
        const notDeliveryInTimeCount = deliveredRequestCount - deliveryInTimeCount;
        const requestAmount = await getRequestsAmount({});
        const courierBoyBonus = await getDeliveryBoyBonus();
        res.send({
            employeeCount,
            adminCount,
            clerkCount,
            deliveryBoyCount,
            customerCount,
            requestCount,
            pendingRequestCount,
            progressRequestCount,
            deliveredRequestCount,
            courierBoyBonus,
            deliveryInTimeCount,
            notDeliveryInTimeCount,
            requestAmount,
        })
    }
    catch(e) {
        res.status(500).send({
            message:
            e.message || "Some error occurred while Dashboard.",
        });
    }
}

async function getRequestsCount(condition) {
   return await DeliveryRequest.count({ where: condition })
}
async function getRequestsAmount(condition) {
    const deliveryRequests = await DeliveryRequest.findAll({ where: condition });

    // Extracting the numerical part from the "price" values and calculating the sum
    const totalPrice = deliveryRequests.reduce((total, request) => {
      const price = parseFloat(request.price.replace(/[$,]/g, ''));
      return total + price;
    }, 0);
  
    return totalPrice;
 }
async function getDeliveryBoyBonus() {
    const query = `
    SELECT SUM(courier_bonus) AS total_sum
    FROM delivery_requests;
    `;
    const result = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    });
    const totalSum = result[0].total_sum;
    return totalSum;
}
async function getUsersCount(condition) {
    return await User.count({ where: condition })
 }

 async function getCustomersCount(condition) {
    return await Customer.count({ where: condition })
 }
 