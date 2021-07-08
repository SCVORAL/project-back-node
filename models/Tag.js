const Sequelize = require("sequelize")
const { sequelize } = require('./../settings/db')

exports.Tag = sequelize.define("tag", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})
