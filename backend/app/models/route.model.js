module.exports = (sequelize, Sequelize) => {
    const Route = sequelize.define("route", {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        source: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        destination: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        } 
    });
    return Route;
  };
