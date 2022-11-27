const { Restaurant, sequelize } = require('../models')
const { QueryTypes } = require('sequelize')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
      const { file } = req // multer 處理完會放在 req.file
      const filePath = await imgurFileHandler(file)
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
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
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id, { raw: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/edit-restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  putRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Restaurant name is required!')
      const { file } = req
      const [restaurant, filePath] = await Promise.all([
        Restaurant.findByPk(id), // 去資料庫查有沒有這間餐廳
        imgurFileHandler(file) // 把檔案傳到 file-helper 處理
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
      })

      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      await sequelize.query(
        `
        DELETE FROM Restaurants
        WHERE id = '${id}'
        `,
        {
          type: QueryTypes.DELETE
        }
      )
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
