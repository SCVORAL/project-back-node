const { sequelize } = require('./../settings/db')
const Sequelize = require("sequelize")

exports.Fandom = sequelize.define("fandom", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlImage: {
    type: Sequelize.STRING,
    allowNull: true
  }
});