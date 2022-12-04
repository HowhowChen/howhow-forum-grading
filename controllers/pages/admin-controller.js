const adminServices = require('../../services/admin-services')
const { User, Restaurant, Category } = require('../../models')
const { imgurFileHandler } = require('../../helpers/file-helpers')

const adminController = {
  getRestaurants: async (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('admin/restaurants', data))
  },
  createRestaurant: async (req, res, next) => {
    try {
      const categories = await Category.findAll({
        raw: true
      })
      res.render('admin/create-restaurant', { categories })
    } catch (err) {
      next(err)
    }
  },
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name) throw new Error('Restaurant name is required!')
      const { file } = req // multer 處理完會放在 req.file
      const filePath = await imgurFileHandler(file)
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
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
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      // const restaurant = await Restaurant.findByPk(id, { raw: true })
      const [restaurant, categories] = await Promise.all([
        Restaurant.findByPk(id, { raw: true }),
        Category.findAll({ raw: true })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/edit-restaurant', { restaurant, categories })
    } catch (err) {
      next(err)
    }
  },
  putRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name, tel, address, openingHours, description, categoryId } = req.body
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
        image: filePath || restaurant.image, // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        categoryId
      })

      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => {
      if (err) return next(err)
      res.session.deleteRestaurant = data
      return res.redirect('/admin/restaurants')
    })
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        raw: true
      })
      res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  },
  patchUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exists!")
      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      await user.update({
        isAdmin: !user.isAdmin
      })
      req.flash('success_messages', '使用者權限變更成功')
      res.redirect('/admin/users')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
