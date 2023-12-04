const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.session = require("./session.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.company = require("./company.model.js")(sequelize, Sequelize);
db.customer = require("./customer.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.delivery_request = require("./delivery_request.model.js")(sequelize, Sequelize);
db.route = require("./route.model.js")(sequelize, Sequelize);

// foreign key for session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.session.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for user
db.company.hasMany(db.user, {
  foreignKey: {
    name: "company_id", 
    allowNull: true,
  },
  onDelete: 'CASCADE',
});
db.role.hasMany(db.user, {
  foreignKey: {
    name: "role_id", 
    allowNull: true,
  },
  onDelete: 'CASCADE',
});

// foreign key for delivery request

db.company.hasMany(db.delivery_request, {
  as: "delivery_1",
  foreignKey: {
    name: "company_id", 
    allowNull: true,
  },
  onDelete: 'CASCADE',
});
db.user.hasMany(db.delivery_request, {
  as: "delivery_2",
  foreignKey: {
    name: "placed_by", 
    allowNull: true,
  },
  onDelete: 'CASCADE',
});
db.user.hasMany(db.delivery_request, {
  as: "delivery_3",
  foreignKey: {
    name: "courier_id", 
    allowNull: true,
  },
  onDelete: 'CASCADE',
});
db.customer.hasMany(db.delivery_request, {
  as: "delivery_4",
  foreignKey: {
    name: "customer_id", 
    allowNull: true,
  },
  onDelete: 'CASCADE',
});

db.delivery_request.belongsTo(db.company, {
  foreignKey: 'company_id',
  as: 'company_details'
});

db.delivery_request.belongsTo(db.user, {
  foreignKey: 'placed_by',
  as: 'placed_by_details'
});

db.delivery_request.belongsTo(db.user, {
  foreignKey: 'courier_id',
  as: 'courier_details'
});

db.delivery_request.belongsTo(db.customer, {
  foreignKey: 'customer_id',
  as: 'customer_details'
});

module.exports = db;
