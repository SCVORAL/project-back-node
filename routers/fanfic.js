const {Router} = require('express')
const {check} = require('express-validator')
const router = Router()
const { getFanFic, img, getFandom, getTags, addFanFic, getAllFanFic } = require('./../controller/fanFicController')

router.get(
  '/getfanfic',
  getFanFic
)

router.get(
  '/getFandom',
  getFandom
)

router.post(
  '/getAllFanFic',
  getAllFanFic
)

router.get(
  '/gettags',
  getTags
)

router.post(
  '/addfanfic',
  addFanFic
)

module.exports = router