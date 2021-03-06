const {Router} = require('express')
const {check} = require('express-validator')
const router = Router()
const { getFanFic, img, getFandom, getTags, addFanFic, editFanFic, getAllFanFic, getFanFicId, addChapter, updateChapter, addFandom, tagAdd, delChapter, deleteFanFic} = require('./../controller/fanFicController')

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

router.post(
  '/getFanFicId',
  getFanFicId
)

router.post(
  '/deleteFanFic',
  deleteFanFic
)

router.post(
  '/addChapter',
  addChapter
)

router.post(
  '/delChapter',
  delChapter
)

router.post(
  '/updateChapter',
  updateChapter
)

router.post(
  '/tagAdd',
  tagAdd
)

router.post(
  '/addFandom',
  addFandom
)

router.get(
  '/gettags',
  getTags
)

router.post(
  '/addfanfic',
  addFanFic
)

router.post(
  '/editFanFic',
  editFanFic
)

module.exports = router