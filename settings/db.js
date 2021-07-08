const Sequelize = require("sequelize")

// const sequelize = new Sequelize("project", "root", "root", {
//   dialect: "mysql",
//   host: "localhost",
//   define: {
//     timestamps: false
//   }
// });

const sequelize = new Sequelize("b00de8e84caa4d", "b8404a0e", {
  host: "us-cdbr-east-04.cleardb.com",
  dialect: "mysql",
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

exports.sequelize = sequelize

const {Chapter} = require('./../models/Chapter')
const {Comment} = require('./../models/Comment')
const {EmailVerify} = require('./../models/EmailVerify')
const {Fandom} = require('./../models/Fandom')
const {FanFic} = require('./../models/FanFic')
const {FanFicTags} = require('./../models/FanFicTags')
const {Like} = require('./../models/Like')
const {Preference} = require('./../models/Preference')
const {Rating} = require('./../models/Rating')
const {Role} = require('./../models/Role')
const {Tag} = require('./../models/Tag')
const {User} = require('./../models/User')

Role.hasMany(User, { as: "users" })
User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
})

User.hasMany(FanFic, { as: "fanfics" })
FanFic.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
})

User.belongsToMany(Fandom, { through: Preference })
Fandom.belongsToMany(User, { through: Preference })

Fandom.hasMany(FanFic, { as: "fanfics" })
FanFic.belongsTo(Fandom, {
  foreignKey: "fandomId",
  as: "fandom"
})

FanFic.belongsToMany(Tag, { through: FanFicTags })
Tag.belongsToMany(FanFic, { through: FanFicTags })

FanFic.hasMany(Chapter, { as: "chapters" })
Chapter.belongsTo(FanFic, {
  foreignKey: "fanficId",
  as: "fanfic"
})

FanFic.hasMany(Comment, { as: 'comments' })
Comment.belongsTo(FanFic, {
  foreignKey: "fanficId",
  as: "fanfic"
})
User.hasMany(Comment, { as: 'comments' })
Comment.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
})

FanFic.hasMany(Rating, { as: 'ratings' })
Rating.belongsTo(FanFic, {
  foreignKey: "fanficId",
  as: "fanfic"
})
User.hasMany(Rating, { as: 'ratings' })
Rating.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
})

Chapter.hasMany(Like, { as: 'likes' })
Like.belongsTo(Chapter, {
  foreignKey: "chapterId",
  as: "chapter"
})
User.hasMany(Like, { as: 'likes' })
Like.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
})

exports.db = { Chapter, Comment, EmailVerify, Fandom, FanFic, FanFicTags, Like, Preference, Rating, Role, Tag, User }
