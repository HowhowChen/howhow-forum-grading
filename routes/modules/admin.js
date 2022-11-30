const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const multer = require('../../middleware/multer')

router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', multer.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', multer.single('image'), adminController.postRestaurant)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
