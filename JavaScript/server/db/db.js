const Sequelize = require("sequelize");

const db = new Sequelize("postgres://xinyiwu:970218@localhost:5432/tripplanner", {
  logging: false
});

module.exports = db;
