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
  }
}

module.exports = commentServices
