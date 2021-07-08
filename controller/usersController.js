const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {db} = require('./../settings/db')
const { sendEmailVerify } = require('./../settings/emailVerify')
const moment = require('moment')

exports.register = async (req, res) => {

  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(200).json({ error: '0' })
    }

    const { name, email, password, roleId = 1 } = req.body

    const candidate = await db.User.findOne({ where: { email } })

    if (candidate) {
      return res.status(200).json({ error: '1' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    sendEmailVerify(email)

    db.User.create({name, email, password: hashedPassword, emailVerify: false, roleId, firstLogin: true, status: true })

    res.status(200).json({ message: '3' })

  } catch (e){
    res.status(200).json({ error: '2' })
  }

}

exports.verify = async (req, res) => {

  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(200).json({ error: '0' })
    }

    const {email, code} = req.body

    const verifyEmail = await db.EmailVerify.findOne({ where: { email, code } })

    if(!verifyEmail)
      return res.json({ message: 'Введен неверный код или аккаунт уже активирован', error: '1' })

    await db.User.update({ emailVerify: true }, { where: {email} })

    await db.EmailVerify.destroy({ where: {email} })

    res.json({ message: 'Аккаунт активирован', error: '2' })

  } catch (e){
    res.status(200).json({ error: '3' })
  }

}

exports.login = async (req, res) => {

  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(200).json({ message: '0' })
    }

    const {email, password} = req.body

    const user = await db.User.findOne({ where: { email } })

    if (!user){
      return res.status(200).json({ message: '1' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) { 
      return res.status(200).json({ message: '1' })
    }

    const token = jwt.sign(
      { userId: user.id },
      "project",
      { expiresIn: '1h' }
    )

    return res.json({ token, userId: user.id, userStatus: user.status, roleId: user.roleId })

  } catch (e){
    return res.status(200).json({ message: '2' })
  }
}

exports.addAdmin = async (req, res) => {
  try {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некоректные данные при регистрации'
      })
    }

    const {id} = req.body

    await db.User.update({ roleId: 1 }, { where: { id } })

    const users = await db.User.findAll()

    res.send(users)

  } catch(e) {
    res.json({ message: 'Add admin error' })
  }
}

exports.demoteAdmin = async (req, res) => {
  try {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некоректные данные при регистрации'
      })
    }

    const {id} = req.body

    await db.User.update({ roleId: 2 }, { where: { id } })

    const users = await db.User.findAll()

    res.send(users)

  } catch(e) {
    res.json({ message: 'Demote admin error' })
  }
}

exports.delUser = async (req, res) => {
  try {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некоректные данные при регистрации'
      })
    }

    const {id} = req.body

    await db.User.destroy({ where: { id } })

    // const users = await db.User.findAll({ include: ['role'] })
    const users = await db.User.findAll()

    res.send(users)

  } catch(e) {
    res.json({ message: 'Del user error' })
  }
}

exports.blockUser = async (req, res) => {
  try {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некоректные данные при блокировке'
      })
    }

    const {checkedIds} = req.body

    // id1.map(async id => {
      await db.User.update({ status: false }, { where: { id } })
    // })

    // const users = await db.User.findAll({ include: ['role'] })
    const users = await db.User.findAll()

    res.send(users)

  } catch(e) {
    res.json({ message: 'Block user error' })
  }
}

exports.unLockUser = async (req, res) => {
  try {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некоректные данные при разблокировке'
      })
    }
    
    const {checkedIds} = req.body

    checkedIds.map(async id => {
      await db.User.update({ status: true }, { where: { id } })
    })

    const users = await db.User.findAll()

    res.send(users)

    } catch(e) {
      res.json({ message: 'Unlock user error' })
    }
  
}