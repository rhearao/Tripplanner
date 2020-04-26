const Sequelize = require("sequelize");
const db = require("../db");

const Group = db.define("group", {
  name: {
    type: Sequelize.STRING,
  },
  locationName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  startDate: {
    type: Sequelize.STRING,
  },
  endDate: {
    type: Sequelize.STRING,
  },
  lat: {
    type: Sequelize.STRING,
  },
  lng: {
    type: Sequelize.STRING,
  },
});

module.exports = Group;
