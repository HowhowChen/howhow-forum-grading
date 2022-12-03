const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const categoryId = Number(req.query.categoryId) || ''
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          raw: true,
          nest: true,
          include: [Category],
          where: {
            ...categoryId ? { categoryId } : {}
          },
          limit,
          offset
        }),
        Category.findAll({ raw: true })
      ])
      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => ( // 先確認req.user是否存在
        fr.id
      ))
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        isFavorited: favoritedRestaurantsId.includes(r.id)
      }))
      res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id, {
        include: [
          Category,
          { model: Comment, include: [User] }, //  eager loading
          { model: User, as: 'FavoritedUsers' }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts', { by: 1 })
      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id) // 只要符合條件就會立刻回傳true
      res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited
      })
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id, {
        include: [
          Category,
          { model: Comment } // join table
        ]
      })

      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
  },
  getFeeds: async (req, res, next) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          order: [['createdAt', 'DESC']],
          include: [Category],
          limit: 10,
          raw: true,
          nest: true
        }),
        Comment.findAll({
          order: [['createdAt', 'DESC']],
          include: [
            User,
            Restaurant,
            { model: Restaurant, include: [Category] } // let Restaurant join Category
          ],
          limit: 10,
          raw: true,
          nest: true
        })
      ])
      const restaurantsData = restaurants.map(restaurantData => ({
        ...restaurantData,
        description: restaurantData.description.substring(0, 50) + '...'
      }))
      const commentsData = comments.map(commentData => ({
        ...commentData,
        text: commentData.text.substring(0, 50) + '...'
      }))
      res.render('feeds', {
        restaurants: restaurantsData,
        comments: commentsData
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
