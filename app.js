const Sequelize = require("sequelize")
const express = require("express")
const app = express()
// const initialize = require("./initializer")
const { sequelize } = require('./settings/db')
const cors = require('cors')
const bodyParser = require('body-parser')

// app.use(cors({
//   credentials: true,
//   origin: true,
// }))

app.use(cors())
// app.use(express.json({ extended: true }))
app.use(bodyParser.json({limit: "100mb", parameterLimit: 10000000}))
app.use(bodyParser.urlencoded({limit: "100mb", extended: true, parameterLimit: 10000000}))

app.use('/api/auth', require('./routers/auth'))
app.use('/api/fanfic', require('./routers/fanfic'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))

const initializer = async () => {
  try {
    // await sequelize.sync({ force: true })
    sequelize.sync()
    // await initialize()
  } catch (e) {
    console.log(e)
  }
}

initializer()
