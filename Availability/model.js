const Sequelize = require("sequelize");
const sequelize = require("../db");
const User = require("../User/model");

const Availability = sequelize.define("availability", {
  startDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  endDate: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

Availability.belongsTo(User);
User.hasMany(Availability);

module.exports = Availability;
