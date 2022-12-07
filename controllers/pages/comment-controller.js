const commentServices = require('../../services/comment-services')
const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data) => {
      if (err) return next(err)
      req.session.createdData = data
      return res.redirect(`/restaurants/${data.restaurantId}`)
    })
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, (err, data) => {
      if (err) return next(err)
      req.session.createdData = data
      res.redirect(`/restaurants/${data.restaurantId}`)
    })
  }
}
module.exports = commentController
