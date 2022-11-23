const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const restControllers = require('../controllers/restaurant-controllers')
const userController = require('../controllers/user-controller')
const passport = require('../config/passport')

const { generalErrorHandler } = require('../middleware/error-handler')
router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)

router.get('/logout', userController.logout)

router.get('/restaurants', restControllers.getRestaurants)
router.use('/', (req, res) => { res.redirect('/restaurants') })

router.use('/', generalErrorHandler)

module.exports = router
