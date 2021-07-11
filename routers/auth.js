const {Router} = require('express')
const {check} = require('express-validator')
const router = Router()
const { register, login, verify, blockUser, unLockUser, delUser, addUser, addAdmin, getAllUsers } = require('./../controller/usersController')

router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('name', 'Введите Имя').isLength({ min: 1 }),
    check('password', 'Введите пароль').isLength({ min: 1 })
  ],
  register
)

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  login
)

router.post(
  '/verify',
  [
    check('code', '0').isLength({ min: 1 }),
  ],
  verify
)

router.get(
  '/getAllUsers',
  getAllUsers
)

router.post(
  '/addAdmin',
  addAdmin
)

router.post(
  '/addUser',
  addUser
)

router.post(
  '/delete',
  delUser
)

router.post(
  '/block',
  blockUser
)

router.post(
  '/unlock',
  unLockUser
)

module.exports = router
