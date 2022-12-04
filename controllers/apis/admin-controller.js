const adminServices = require('../../services/admin-services')
const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, restaurants) => err ? next(err) : res.json(restaurants))
  }
}

module.exports = adminController
