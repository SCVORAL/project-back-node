const Sequelize = require("sequelize")
const { sequelize } = require('./../settings/db')

exports.FanFic = sequelize.define("fanfic", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  urlImage: {
    type: Sequelize.STRING,
    allowNull: true
  }
})
