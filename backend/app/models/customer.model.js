module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customer", {
    id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contact: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    street: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    avenue: {
      type: Sequelize.STRING,
      allowNull: false,
    },

  });

  return Customer;
};
