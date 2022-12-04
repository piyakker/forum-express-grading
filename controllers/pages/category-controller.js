const { Category } = require('../../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', {
          categories,
          category
        })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
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
