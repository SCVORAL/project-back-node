const Sequelize = require("sequelize")
const { sequelize } = require('./../settings/db')

exports.Comment = sequelize.define("comment", {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  }
})
