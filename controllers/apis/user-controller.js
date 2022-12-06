const jwt = require('jsonwebtoken')
const userServices = require('../../services/user-services')
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  editUser: (req, res, next) => {
    userServices.editUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, (err, data) => err ? next(err) : res.json(data))
  },
  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, (err, data) => err ? next(err) : res.json(data))
  },
  addLike: (req, res, next) => {
    userServices.addLike(req, (err, data) => err ? next(err) : res.json(data))
  },
  removeLike: (req, res, next) => {
    userServices.removeLike(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = userController
