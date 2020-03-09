// const Sequelize = require("sequelize");
const sequelize = require("../db");
const User = require("../User/model");
const Group = require("../Group/model")

const UserGroup = sequelize.define("userGroup");

User.belongsToMany(Group, { through: "userGroup" });
Group.belongsToMany(User, { through: "userGroup" });

module.exports = UserGroup;
