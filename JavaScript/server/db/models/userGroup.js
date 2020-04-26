const Sequelize = require("sequelize");
const db = require("../db");

const UserGroup = db.define("user_group", {
  userId: Sequelize.INTEGER,
  groupId: Sequelize.INTEGER
});

module.exports = UserGroup;
