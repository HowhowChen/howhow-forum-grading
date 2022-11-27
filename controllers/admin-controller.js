const { sequelize } = require('../models')
const { QueryTypes } = require('sequelize')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await sequelize.query(
        `
        SELECT * FROM Restaurants
        `,
        {
          type: QueryTypes.SELECT
        }
      )
      res.render('admin/restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
