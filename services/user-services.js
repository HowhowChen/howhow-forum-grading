const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, sequelize } = require('../models')
const { QueryTypes } = require('sequelize')
const { getUser } = require('../helpers/auth-helpers')

const userServices = {
  signUp: async (req, callback) => {
    try {
      const { name, email, password } = req.body
      const user = await sequelize.query(
        `SELECT * FROM Users
        WHERE email = '${email}'`,
        {
          type: QueryTypes.SELECT
        }
      )

      if (user.length !== 0) throw new Error('Email already exists')
      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        name,
        email,
        password: hash
      })
      callback(null, { newUser })
    } catch (err) {
      callback(err)
    }
  },
  getUser: async (req, callback) => {
    try {
      const { id } = req.params
      const user = getUser(req)

      const [userProfile, comments] = await Promise.all([
        User.findByPk(id, {
          include: [
            { model: Restaurant, as: 'FavoritedRestaurants' },
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
          ]
        }),
        Comment.findAll({
          attributes: ['restaurantId'],
          where: { userId: id },
          group: 'restaurantId',
          include: [Restaurant],
          raw: true,
          nest: true
        })
      ])
      if (!userProfile) throw new Error("User doesn't exist.")
      delete userProfile.password
      delete user.password

      callback(null, {
        user: getUser(req),
        userProfile: userProfile.toJSON(),
        comments
      })
    } catch (err) {
      callback(err)
    }
  }
}

module.exports = userServices
