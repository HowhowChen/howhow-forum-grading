const bcrypt = require('bcryptjs')
const { Comment, Restaurant, User, Favorite, Like, Followship, sequelize } = require('../models')
const { QueryTypes } = require('sequelize')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
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
      await User.create({
        name,
        email,
        password: hash
      })
      req.flash('success_messages', '成功註冊帳號!')
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = getUser(req)

      const [userProfile, comments] = await Promise.all([
        User.findByPk(id, {
          raw: true
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

      res.render('users/profile', {
        user: getUser(req),
        userProfile,
        comments
      })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, {
        raw: true
      })
      if (!user) throw new Error("User doesn't exist.")
      res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      const { id } = req.params
      const { file } = req

      if (!name.trim()) throw new Error('Name must be filled in')
      const [user, filePath] = await Promise.all([
        User.findByPk(id),
        imgurFileHandler(file)
      ])
      if (!user) throw new Error("User doesn't exist.")
      await user.update({
        name,
        image: filePath || user.image
      })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${id}`)
    } catch (err) {
      next(err)
    }
  },
  addFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: {
            userId: req.user.id,
            restaurantId
          }
        })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exists!")
      if (favorite) throw new Error('You have favorited this restaurant!')
      await Favorite.create({
        userId: req.user.id,
        restaurantId
      })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: {
            userId: req.user.id,
            restaurantId
          }
        })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exists!")
      if (!favorite) throw new Error("You haven't favorited this restaurant!")
      await favorite.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: {
            userId: req.user.id,
            restaurantId
          }
        })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exists!")
      if (like) throw new Error('You have liked this restaurant')
      await Like.create({
        userId: req.user.id,
        restaurantId
      })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: {
            userId: req.user.id,
            restaurantId
          }
        })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exists!")
      if (!like) throw new Error("You haven't liked this restaurant!")
      await like.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ]
      })
      users = users
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
      res.render('top-users', { users })
    } catch (err) {
      next(err)
    }
  },
  addFollowing: async (req, res, next) => {
    try {
      const { userId } = req.params
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: req.user.id,
            followingId: userId
          }
        })
      ])
      if (!user) throw new Error("User didn't exists!")
      if (followship) throw new Error('You are already following this user!')
      await Followship.create({
        followerId: req.user.id,
        followingId: userId
      })
      res.redirect('/users/top')
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const { userId } = req.params
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: req.user.id,
            followingId: userId
          }
        })
      ])
      if (!user) throw new Error("User didn't exists!")
      if (!followship) throw new Error("You haven't followed this user!")
      followship.destroy()
      res.redirect('/users/top')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
