module.exports = (sequelize, Sequelize) => {
  const DeliveryRequest = sequelize.define("delivery_request", {
    id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pickup_address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    delivery_address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    pickup_date_time: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    pickedup_date_time: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    delivered_date_time: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    courier_bonus: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    deliveredInTime: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    delivery_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    average_time: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    distance: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return DeliveryRequest;
};
