const { User } = require('../../models') // 新增這裡
const adminServices = require('../../services/admin-services')

const adminController = {

  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) =>
      err ? next(err) : res.render('admin/restaurants', data))
  },
  createRestaurant: (req, res, next) => {
    adminServices.createRestaurant(req, (err, data) =>
      err ? next(err) : res.render('admin/create-restaurant', data))
  },
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants', data)
      req.session.createdData = data
      return res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res, next) => {
    adminServices.getRestaurant(req, (err, data) =>
      err ? next(err) : res.render('admin/restaurant', data))
  },
  editRestaurant: (req, res, next) => {
    adminServices.editRestaurant(req, (err, data) =>
      err ? next(err) : res.render('admin/edit-restaurant', data))
  },
  putRestaurant: (req, res, next) => {
    adminServices.putRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was successfully to update')
      req.session.createdData = data
      return res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.session.deletedData = data
      return res.redirect('/admin/restaurants')
    })
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) =>
      err ? next(err) : res.render('admin/users', data))
  },
  patchUser: (req, res, next) => {
    const id = Number(req.params.id)
    return User.findByPk(id)
      .then(user => {
        if (user.toJSON().isAdmin === true) {
          if (user.toJSON().email === 'root@example.com') {
            req.flash('error_messages', '禁止變更 root 權限')
            return res.redirect('back')
          }
          req.flash('success_messages', '使用者權限變更成功')
          return user.update({ isAdmin: false })
        }
        req.flash('success_messages', '使用者權限變更成功')
        return user.update({ isAdmin: true })
      })
      .then(() => {
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
