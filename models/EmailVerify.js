const Sequelize = require("sequelize")
const { sequelize } = require('./../settings/db')

exports.EmailVerify = sequelize.define("emailVerify", {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false
  },
})
