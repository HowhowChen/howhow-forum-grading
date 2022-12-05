const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  addFavorited: (req, res, next) => {
    restaurantServices.addFavorited(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteFavorited: (req, res, next) => {
    restaurantServices.deleteFavorited(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = restaurantController
