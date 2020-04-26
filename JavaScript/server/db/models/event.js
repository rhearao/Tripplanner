const Sequelize = require("sequelize");
const db = require("../db");

const Event = db.define("event", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
  },
  category: {
    type: Sequelize.STRING,
  },
  startTime: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  endTime: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Date: {
    type: Sequelize.DATE,
  },
  detail: {
    type: Sequelize.STRING,
  },
  lat: {
    type: Sequelize.STRING,
  },
  lng: {
    type: Sequelize.STRING,
  },
});

module.exports = Event;
