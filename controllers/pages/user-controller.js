const { User, Followship } = require('../../models')
const userServices = require('../../services/user-services')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => {
      if (err) next(err)
      req.flash('success_messages', '成功註冊帳號！')
      req.session.createdData = data
      res.redirect('/signin')
    })
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.render('users/profile', data))
  },
  editUser: (req, res, next) => {
    userServices.editUser(req, (err, data) => err ? next(err) : res.render('users/edit', data))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, data) => {
      if (err) next(err)
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${req.params.id}`)
    })
  },
  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, (err, data) => {
      if (err) next(err)
      req.session.createdData = data
      return res.redirect('back')
    })
  },
  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, (err, data) => {
      if (err) next(err)
      req.destroyedData = data
      return res.redirect('back')
    })
  },
  addLike: (req, res, next) => {
    userServices.addLike(req, (err, data) => {
      if (err) next(err)
      req.createdData = data
      return res.redirect('back')
    })
  },
  removeLike: (req, res, next) => {
    userServices.removeLike(req, (err, data) => {
      if (err) next(err)
      req.destroyedData = data
      return res.redirect('back')
    })
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, data) =>
      err ? next(err) : res.render('top-users', data))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = userController
