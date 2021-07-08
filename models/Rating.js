const Sequelize = require("sequelize")
const { sequelize } = require('./../settings/db')

exports.Rating = sequelize.define("rating", {
  value: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})
