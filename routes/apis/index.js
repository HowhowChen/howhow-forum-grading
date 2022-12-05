const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const commentController = require('../../controllers/apis/comment-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) // 新增這行，設定 disable sessions

router.get('/restaurants/:id/comment', authenticated, commentController.getComments)
router.post('/restaurants/:id/comment', authenticated, commentController.postComment)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.delete('/comments/:id', authenticated, commentController.deleteComment)

router.get('/users/:id', authenticated, userController.getUser)

router.get('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Page not found'
  })
})

router.use('/', apiErrorHandler)

module.exports = router
