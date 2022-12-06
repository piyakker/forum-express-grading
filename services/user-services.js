const { User, Restaurant, Comment, Favorite } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { localFileHandler } = require('../helpers/file-helpers')
const bcrypt = require('bcryptjs')

const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(newUser => cb(null, { user: newUser }))
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    const id = Number(req.params.id)
    return Promise.all([
      User.findOne({
        where: { id },
        nest: true,
        raw: true
      }),
      Comment.findAndCountAll({
        where: { userId: id },
        include: Restaurant,
        order: [['id', 'desc']],
        nest: true,
        raw: true
      })
    ])
      .then(([profile, comments]) => {
        if (!profile) throw new Error('User not found!')
        const restaurants = comments.rows.map(x => x.Restaurant)
        return cb(null, {
          user: getUser(req),
          profile,
          commentsCount: comments.count,
          restaurants
        })
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    const id = Number(req.params.id)
    return User.findOne({
      where: { id },
      nest: true,
      raw: true
    })
      .then(user => cb(null, { user }))
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    return Promise.all([
      User.findOne({ where: { id: req.params.id } }),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(updatedUser => {
        cb(null, { user: updatedUser })
      })
      .catch(err => cb(err))
  },
  addFavorite: (req, cb) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')

        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(newFavorite => cb(null, { Favorite: newFavorite.toJSON() }))
      .catch(err => cb(err))
  },
  removeFavorite: (req, cb) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")
        return favorite.destroy()
      })
      .then(destroyedFavorite => cb(null, { favorite: destroyedFavorite }))
      .catch(err => cb(err))
  }
}

module.exports = userServices
