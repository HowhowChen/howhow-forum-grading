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
  }
}

module.exports = adminServices
