const { Restaurant, Category } = require('../models')

const adminServices = {
  getRestaurants: async (req, callback) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      callback(null, { restaurants })
    } catch (err) {
      callback(err)
    }
  },
  deleteRestaurant: async (req, callback) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id)
      if (!restaurant) {
        const err = new Error("Restaurant didn't exist!")
        err.status = 404
        throw err
      }
      const deletedRestaurant = await restaurant.destroy()

      callback(null, { restaurant: deletedRestaurant })
    } catch (err) {
      callback(err)
    }
  }
}

module.exports = adminServices
