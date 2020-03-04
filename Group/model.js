const Sequelize = require("sequelize");
const sequelize = require("../db");

const Group = sequelize.define("group", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Group;
