const bcrypt = require('bcryptjs')
const { User, sequelize } = require('../models')
const { QueryTypes } = require('sequelize')
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
  }
}

module.exports = userController
