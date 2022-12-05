const { Restaurant, Comment, User } = require('../models')

const commentServices = {
  getComments: async (req, callback) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id, {
        include: [
          { model: Comment, include: User }
        ]
      })
      if (!restaurant) throw new Error("The restaurant didn't exists!")
      callback(null, { comments: restaurant.toJSON().Comments })
    } catch (err) {
      callback(err)
    }
  },
  postComment: async (req, callback) => {
    try {
      const { id } = req.params
      const userId = req.user.toJSON().id
      const { text } = req.body
      const [user, restaurant] = await Promise.all([
        User.findByPk(userId),
        Restaurant.findByPk(id)
      ])
      if (!user) throw new Error("User didn't exists!")
      if (!restaurant) throw new Error("Restaurant didn't exists!")
      const newComment = await Comment.create({
        text,
        userId,
        restaurantId: id
      })
      callback(null, { newComment })
    } catch (err) {
      callback(err)
    }
  }
}

module.exports = commentServices
