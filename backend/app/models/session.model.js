module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define("session", {
    id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expirationDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  return Session;
};
