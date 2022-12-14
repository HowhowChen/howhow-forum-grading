const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { restaurantId, text } = req.body
      const userId = req.user.id
      const [user, restaurant] = await Promise.all([
        User.findByPk(userId),
        Restaurant.findByPk(restaurantId)
      ])
      if (!user) throw new Error("User didn't exists!")
      if (!restaurant) throw new Error("Restaurant didn't exists!")
      await Comment.create({
        text,
        restaurantId,
        userId
      })
      res.redirect(`/restaurants/${restaurantId}`)
    } catch (err) {
      next(err)
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const { id } = req.params
      const comment = await Comment.findByPk(id)
      if (!comment) throw new Error("Comment didn't exists!")
      const deletedComment = await comment.destroy()
      res.redirect(`/restaurants/${deletedComment.restaurantId}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = commentController
