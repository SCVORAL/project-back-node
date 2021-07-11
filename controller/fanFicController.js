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

  console.log(chapter)

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

}

exports.getAllFanFic = async (req, res) => {

  const {idFandom} = req.body
  
  const fanfic = await db.FanFic.findAll({
    where: {fandomId: idFandom},
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

    const urlImage = await cloudinary.uploader.upload(imgBase64)

    let fanfic = await db.FanFic.create({ 
      name, 
      description, 
      urlImage: urlImage.url, 
      userId, 
      fandomId 
    })

    for (let i = 0; i < tags.length; i++) {
      let tag = await db.Tag.findOne({ where: { name: tags[i] } })
      if (!tag) {
        tag = await db.Tag.create({
          name: tags[i]
        })
      }
      await fanfic.addTag(
        tag, { through: { grade: 1 } }
      )
    }

    fanfic = await db.FanFic.findByPk(fanfic.id, { include: ['tags', 'fandom'] })

    return fanfic
    
  } catch (e) {

  }

}

exports.img = async (req, res) => {

  // Удаление

  // cloudinary.v2.api.delete_resources("cvjrsl7u66w1rhdnp00f",
  // function(error, result) {console.log(result, error); });

}