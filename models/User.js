const Sequelize = require("sequelize")
const { sequelize } = require('./../settings/db')

exports.User = sequelize.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  emailVerify: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  firstLogin: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});