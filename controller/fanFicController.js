const {db} = require('./../settings/db')
const cloudinary = require('cloudinary')
const {validationResult} = require('express-validator')
const moment = require('moment')

cloudinary.config({ 
  cloud_name: 'scvoral', 
  api_key: '586858748185841', 
  api_secret: 'qVgswSjUvQPC2Ai3NhwnFwN62dM',
  secure: true
});

exports.getFandom = async (req, res) => {
  
  const fandom = await db.Fandom.findAll()

  res.send(fandom)

}

exports.getFanFicId = async (req, res) => {

  const {idFanFic} = req.body

  console.log(idFanFic)
  
  const fanfic = await db.FanFic.findOne({
    where: {id: idFanFic}, include: [
      // {
      //   model: db.Tag,
      //   as: 'tags',
      //   attributes: ['name']
      // },
      {
        model: db.User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'firstLogin'],
        include: ['role']
      }, {
        model: db.Fandom,
        as: 'fandom',
        attributes: ['name']
      },
      {
        model: db.Rating,
        as: 'ratings',
        attributes: ['value']
      },
      {
        model: db.Chapter,
        as: 'chapters',
      },
      {
        model: db.Comment,
        as: 'comments'
      }
    ]
  })

  res.send(fanfic)

}

exports.deleteFanFic = async (req, res) => {

  const { id } = req.body

  console.log( id )
  
  await db.FanFic.destroy({ where: { id } })

  res.json({ message: '1' })

}

exports.addChapter = async (req, res) => {

  const {name, content, fanficId} = req.body
  
  const chapter = await db.Chapter.create({
    name,
    content,
    fanficId
  })

  await db.FanFic.update({
    lastDateUpdate: moment().format('YYYY-MM-DD hh:mm:ss')
  }, { where: { id: fanficId } })

   res.json({ "message": 1 })

}

exports.updateChapter = async (req, res) => {

  const {name, content, id} = req.body

  console.log(req.body)
  
  const chapter = await db.Chapter.update({
    name,
    content
  }, {where: {id}} )

  await db.FanFic.update({
    lastDateUpdate: moment().format('YYYY-MM-DD hh:mm:ss')
  }, { where: { id } })

   res.json({ "message": 1 })

}

exports.addFandom = async (req, res) => {

  const { name, imgBase64 } = req.body

  const urlImage = await cloudinary.uploader.upload(imgBase64)

  const fandom = await db.Fandom.findAll({ where: {name} })

  if (fandom.length)
    return res.json({ "error": 1 })

  
  await db.Fandom.create({
    name,
    urlImage: urlImage.url
  })

  res.json({ "message": 1 })

}

exports.tagAdd = async (req, res) => {

  const { name } = req.body

  console.log(name)

  const tagFind = await db.Tag.findAll({ where: {name} })

  if (tagFind.length)
    return res.json({ "error": 1 })
  
  await db.Tag.create({
    name
  })

  res.json({ "message": 1 })

}

exports.delChapter = async (req, res) => {

  const { id, fanficId } = req.body

  await db.Chapter.destroy({ where: { id } })

  await db.FanFic.update({
      lastDateUpdate: moment().format('YYYY-MM-DD hh:mm:ss')
  }, { where: { id: fanficId } })

  res.json({ "message": 1 })

}

exports.getAllFanFic = async (req, res) => {

  const {idFandom} = req.body
  
  const fanfic = await db.FanFic.findAll({
    where: {fandomId: idFandom},
    order: [['id', 'DESC']],
    include: [
      {
        model: db.Tag,
        as: 'tags',
        attributes: ['name']
      },
      {
        model: db.User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'firstLogin'],
        include: ['role']
      }, {
        model: db.Fandom,
        as: 'fandom',
        attributes: ['name']
      },
      {
        model: db.Rating,
        as: 'ratings',
        attributes: ['value']
      },
      {
        model: db.Chapter,
        as: 'chapters',
      },
      {
        model: db.Comment,
        as: 'comments'
      }
    ]
  })

  res.send(fanfic)

}

exports.getTags = async (req, res) => {
  
  const tags = await db.Tag.findAll()

  res.send(tags)

}

exports.getFanFic = async (req, res) => {
  
  const fanfic = await db.FanFic.findAll( { include: ['chapters'] } )

  res.send(fanfic)

}

exports.addFanFic = async (req, res) => {
  try {

    const { userId, name, fandomId, tags, description, imgBase64 } = req.body

    let urlImage = 'https://res.cloudinary.com/scvoral/image/upload/v1626026369/woocommerce-placeholder_p43qds.png'

    if(imgBase64 !== null){
      const obj = await cloudinary.uploader.upload(imgBase64)
      urlImage = obj.url
    }

    let fanfic = await db.FanFic.create({ 
      name, 
      description, 
      urlImage, 
      userId, 
      fandomId 
    })

    res.json({ "message": 1 })
    
  } catch (e) {

  }

}

exports.editFanFic = async (req, res) => {

  const {id, name, fandomId, description, imgBase64, urlImg} = req.body

  if (imgBase64 === ''){

    await db.FanFic.update({
      name,
      fandomId,
      description
    }, {where: {id}} )

  } else {

    let idImg = urlImg.split('/')
    idImg = idImg[idImg.length - 1].split('.')

    if(idImg[0] === 'woocommerce-placeholder_p43qds')
      await cloudinary.v2.uploader.destroy(idImg[0])

    const urlImage = await cloudinary.uploader.upload(imgBase64)

    await db.FanFic.update({
      name,
      fandomId,
      description,
      urlImage: urlImage.url
    }, {where: {id}} )

  }

   res.json({ "message": 1 })

}