const { Restaurant, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
  postRestaurant: async (req, callback) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name) throw new Error('Restaurant name is required!')
      const { file } = req // multer 處理完會放在 req.file
      const filePath = await imgurFileHandler(file)
      const newRestaurant = await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      })
      callback(null, { newRestaurant })
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
