const { Restaurant, sequelize } = require('../models')
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
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Restaurant name is required!')
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description
      })
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id, { raw: true })
      if (restaurant.length === 0) throw new Error("Restaurant didn't exist!")
      res.render('admin/restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
