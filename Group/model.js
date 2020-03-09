const Sequelize = require("sequelize");
const sequelize = require("../db");
const User = require("../User/model")

const Group = sequelize.define("group", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Group.belongsTo(User);


module.exports = Group;
