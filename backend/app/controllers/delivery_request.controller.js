const db = require("../models");
const DeliveryRequest = db.delivery_request;
const Customer = db.customer;
const User = db.user;
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const Route = db.route;
const nodemailer = require('nodemailer');

// Create and Save a new DeliveryRequest
exports.create = (req, res) => {
  // Validate request
  if (req.body.pickup_address === undefined) {
    const error = new Error("pickup_address cannot be empty for delivery_request!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.delivery_address === undefined) {
    const error = new Error("delivery_address cannot be empty for delivery_request!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.pickup_date_time === undefined) {
    const error = new Error("pickup_date_time cannot be empty for delivery_request!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.price === undefined) {
    const error = new Error("price cannot be empty for delivery_request!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.average_time === undefined) {
    const error = new Error("average_time cannot be empty for delivery_request!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.distance === undefined) {
    const error = new Error("distance cannot be empty for delivery_request!");
    error.statusCode = 400;
    throw error;
  }

  req.body.delivery_status = req.body.delivery_status || "pending"
  
  // Save DeliveryRequest in the database
  DeliveryRequest.create(req.body)
    .then((data) => {
      res.send(data);
      sendEmail(data,"You have placed an order for courier successfully!")
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the DeliveryRequest.",
      });
    });
};

exports.findDistance = async(req, res) => {
  if (req.body.pickup_street === undefined) {
     const error = new Error("pickup_street cannot be empty for delivery_request!");
     error.statusCode = 400;
     throw error;
   }
   else if (req.body.pickup_avenue === undefined) {
     const error = new Error("pickup_avenue cannot be empty for delivery_request!");
     error.statusCode = 400;
     throw error;
   } 
   else if (req.body.delivery_street === undefined) {
     const error = new Error("delivery_street cannot be empty for delivery_request!");
     error.statusCode = 400;
     throw error;
   }
   else if (req.body.delivery_avenue === undefined) {
     const error = new Error("delivery_avenue cannot be empty for delivery_request!");
     error.statusCode = 400;
     throw error;
   }
   const distance = await findShortestPath(req.body)
   console.log("dis",distance)
   if(distance) {
     res.send({
       distance: distance,
       price: "$ "+distance* 10 ,
       average_time: distance*1.5+" Minutes",
     });
   }
   else {
     res.status(500).send({
       message: "Error in calculating the distance",
     });
   }
 };

// Retrieve all DeliveryRequests from the database.
exports.findAll = (req, res) => {
  const deliveryRequestId = req.query.deliveryRequestId;
  var condition = deliveryRequestId
    ? {
        id: {
          [Op.like]: `%${deliveryRequestId}%`,
        },
      }
    : null;

  DeliveryRequest.findAll({ where: condition, order: [["id", "DESC"]], include: [  { model: Customer, as: 'customer_details' },{ model: User, as: 'placed_by_details' },{ model: User, as:'courier_details'}] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving delivery_requests.",
      });
    });
};

exports.findAllForUser = (req,res) => {
  var condition = {
    placed_by: req.params.userId,
  }

  DeliveryRequest.findAll({ where: condition, order: [["id", "DESC"]], include: [  { model: Customer, as: 'customer_details' },{ model: User, as: 'placed_by_details' },{ model: User, as:'courier_details'}] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving delivery_requests.",
      });
    });
}

exports.findAllForCustomer = (req,res) => {
  var condition = {
    customer_id: req.params.customerId,
  }

  DeliveryRequest.findAll({ where: condition, order: [["id", "DESC"]], include: [  { model: Customer, as: 'customer_details' },{ model: User, as: 'placed_by_details' },{ model: User, as:'courier_details'}] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving delivery_requests.",
      });
    });
}

exports.findAllForCourier = (req,res) => {
  var condition = {
    courier_id: req.params.courierId,
  }

  DeliveryRequest.findAll({ where: condition, order: [["id", "DESC"]], include: [  { model: Customer, as: 'customer_details' },{ model: User, as: 'placed_by_details' },{ model: User, as:'courier_details'}] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving delivery_requests.",
      });
    });
}

exports.findAllForCompany = (req,res) => {
  var condition = {
    company_id: req.params.companyId,
  }

  DeliveryRequest.findAll({ where: condition, order: [["id", "DESC"]], include: [  { model: Customer, as: 'customer_details' },{ model: User, as: 'placed_by_details' },{ model: User, as:'courier_details'}] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving delivery_requests.",
      });
    });
}

// Find a single DeliveryRequest with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  DeliveryRequest.findByPk(id,{ include: [  { model: Customer, as: 'customer_details' },{ model: User, as: 'placed_by_details' },{ model: User, as:'courier_details'}]})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving DeliveryRequest with id=" + id,
      });
    });
};

// Update a DeliveryRequest by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  DeliveryRequest.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "DeliveryRequest was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update DeliveryRequest with id=${id}. Maybe DeliveryRequest was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating DeliveryRequest with id=" + id,
      });
    });
};

// Delete a DeliveryRequest with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  DeliveryRequest.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "DeliveryRequest was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete DeliveryRequest with id=${id}. Maybe DeliveryRequest was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete DeliveryRequest with id=" + id,
      });
    });
};

// Delete all DeliveryRequests from the database.
exports.deleteAll = (req, res) => {
  DeliveryRequest.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} DeliveryRequests were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all delivery_requests.",
      });
    });
};

exports.pickedup  = async(req, res) => {
  try{
  const id = req.params.id;
  const deliveryRequest = await DeliveryRequest.findByPk(id)
  DeliveryRequest.update({pickedup_date_time: Sequelize.literal('CURRENT_TIMESTAMP'),delivery_status:"progress"}, {
    where: { id: id },
  })
    .then((response) => {
      if (response == 1) {
        res.send({
          message: "delivery request was updated successfully.",
        });
        sendEmail(deliveryRequest,"Your Order is picked up by courier boy. It will reach the destination in "+deliveryRequest.average_time)
      } else {
        res.status(500).send({
          message: `Cannot update delivery request with id=${id}. Maybe delivery request was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating delivery request with id=" + id,
      });
    });
  }
  catch(e) {
    res.status(500).send({
      message: e.message || "Error updating delivery request with id=" + id,
    });
  }
};

function isDeliveredInTime(pickedup_date_time, current_time, average_time) {
  const pickedupTime = new Date(pickedup_date_time);
  const timeDifference = current_time - pickedupTime;
  const minutesDifference = Math.floor(timeDifference / 1000 / 60);

  return minutesDifference <= average_time;
}

exports.delivered  = async(req, res) => {
  try {
  const id = req.params.id;
  const deliveryRequest  = await DeliveryRequest.findByPk(id)
  const deliveredInTime = isDeliveredInTime(deliveryRequest.pickedup_date_time,new Date(),deliveryRequest.average_time)

  DeliveryRequest.update({ delivered_date_time: Sequelize.literal('CURRENT_TIMESTAMP'),delivery_status:"DELIVERED",deliveredInTime: deliveredInTime , courier_bonus: deliveredInTime ? 10 : 0 }, {
    where: { id: id },
  })
    .then((response) => {
      if (response == 1) {
        res.send({
          message: "delivery request was updated successfully.",
        });
        sendEmail(deliveryRequest,"Your Order is Delivered!")
      } else {
        res.status(500).send({
          message: `Cannot update delivery request with id=${id}. Maybe delivery request was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating delivery request with id=" + id,
      });
    });
  }
  catch(e) {
    res.status(500).send({
      message: e.message || "Error updating delivery request with id=" + id,
    });
  }
};

async function sendEmail(data,text){
  const customer = await Customer.findByPk(data.customer_id);
 // Create a transporter object
 const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'S.rayavaram@eagles.oc.edu',
    pass: 'oezxsfacdrpdljgt'
  }
});

// Define the email options
const mailOptions = {
  from: 'S.rayavaram@eagles.oc.edu',
  to: customer.email,
  subject:"ACME COURIERS",
  text: "Hi "+customer.name+","+ text,
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error sending email:', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});

}

// Dijkstra's algorithm
async function findShortestPath(body) {
  const { pickup_street,pickup_avenue,delivery_street,delivery_avenue} = body
  const pickup = pickup_avenue+pickup_street
  const delivery = delivery_avenue+delivery_street
  const locations = await Route.findAll();
  const graphForLocations = {};
  locations.forEach((entry) => {
    const { source, destination } = entry;
    if (!graphForLocations[source]) {
      graphForLocations[source] = {};
    }
    graphForLocations[source][destination] = 1;
  });
  const distances = {};
  const visited = {};
  Object.keys(graphForLocations).forEach((vertex) => {
    distances[vertex] = Infinity;
  });
  distances[pickup] = 0;
  while (true) {
    let closestVertex = null;
    let closestDistance = Infinity;
    Object.keys(graphForLocations).forEach((vertex) => {
      if (!visited[vertex] && distances[vertex] < closestDistance) {
        closestVertex = vertex;
        closestDistance = distances[vertex];
      }
    });
    if (closestVertex === null) {
      break;
    }
    visited[closestVertex] = true;
    Object.keys(graphForLocations[closestVertex]).forEach((neighbor) => {
      const distance = closestDistance + graphForLocations[closestVertex][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
      }
    });
  }
  console.log("dis1",distances)
  return distances[delivery];
}

