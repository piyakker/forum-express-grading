const { Restaurant, Category, User } = require('../models') // 新增這裡
const { localFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  getRestaurants: (req, cb) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        return cb(null,
          { restaurants }
        )
      })
      .catch(err => cb(err))
  },
  createRestaurant: (req, cb) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => cb(null, { categories }))
      .catch(err => cb(err))
  },
  postRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    localFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      }))
      .then(newRestaurant => cb(null, { restaurant: newRestaurant }))
      .catch(err => cb(err))
  },
  getRestaurant: (req, cb) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return cb(null, { restaurant })
      })
      .catch(err => cb(err))
  },
  editRestaurant: (req, cb) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return cb(null, { restaurant, categories })
      })
      .catch(err => cb(err))
  },
  putRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    Promise.all([
      Restaurant.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          categoryId
        })
      })
      .then(updatedRestaurant => cb(null, { restaurant: updatedRestaurant }))
      .catch(err => cb(err))
  },
  deleteRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(deletedRestaurant => cb(null, { restaurant: deletedRestaurant }))
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    return User.findAll({
      raw: true
    })
      .then(users => cb(null, { users }))
      .catch(err => cb(err))
  },
  patchUser: (req, cb) => {
    const id = Number(req.params.id)
    return User.findByPk(id)
      .then(user => {
        if (user.toJSON().isAdmin === true) {
          if (user.toJSON().email === 'root@example.com') {
            return user
          }
          return user.update({ isAdmin: false })
        }
        return user.update({ isAdmin: true })
      })
      .then(updatedUser => cb(null, { user: updatedUser.toJSON() }))
      .catch(err => cb(err))
  }
}

module.exports = adminServices
