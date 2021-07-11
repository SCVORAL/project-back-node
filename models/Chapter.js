const Sequelize = require("sequelize")
const { sequelize } = require('./../settings/db')

exports.Chapter = sequelize.define("chapter", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: true
  }
})
