const { User, Restaurant, Comment } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
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
  }
}

module.exports = userServices
