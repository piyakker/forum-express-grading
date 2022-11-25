const express = require('express')
const router = express.Router()

const { authenticatedAdmin } = require('../../middleware/auth')
const adminControllers = require('../../controllers/admin-controllers')

router.get('/restaurants', authenticatedAdmin, adminControllers.getRestaurants)
router.use('/', (req, res) => { res.redirect('/admin/restaurants') })

module.exports = router
