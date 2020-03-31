const sequelize = require("../db");
const User = require("../User/model");
const Group = require("../Group/model");

const GroupUser = sequelize.define('groupUser');

User.belongsToMany(Group, { through: "groupUser" });
Group.belongsToMany(User, { through: "groupUser" });

module.exports = GroupUser;
