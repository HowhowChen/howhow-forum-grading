const bcrypt = require('bcryptjs')
const { User } = require('../models')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password } = req.body
      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
