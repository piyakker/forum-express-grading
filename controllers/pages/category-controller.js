const { Category } = require('../../models')
const categoryServices = require('../../services/category-services')
const categoryController = {
  getCategories: (req, res, next) => {
    categoryServices.getCategories(req, (err, data) =>
      err ? next(err) : res.render('admin/categories', data))
  },
  postCategory: (req, res, next) => {
    categoryServices.postCategory(req, (err, data) => {
      if (err) return next(err)
      req.session.createdData = data
      return res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res, next) => {
    categoryServices.putCategory(req, (err, data) => {
      if (err) return next(err)
      req.session.createdData = data
      return res.redirect('/admin/categories')
    })
  },
  deleteCategory: (req, res, next) => {
    // promise.all
    // 找到所有餐廳的分類是req.params.id的
    // 找到該分類
    // 餐廳的分類改設為 (未分類)
    // 刪除該分類
    // return Promise.all([
    //   Restaurant.findAll({ where: { categoryId: req.params.id } }),
    //   Category.findOne({ where: { id: req.params.id } })
    // ])
    //   .then(([restaurants, category]) => {
    //     if (!category) throw new Error("Category didn't exist!")
    //     if (!restaurants.length) {
    //       return category.destroy()
    //     }
    //     return Promise.all([
    //       restaurants.map(restaurant => restaurant.removeCategory(restaurant.Category)),
    //       category.destroy()
    //     ])
    //   })
    //   .then(() => res.redirect('/admin/categories'))
    //   .catch(err => next(err))
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}
module.exports = categoryController
