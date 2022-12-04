const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')
const user = require('../models/user')

//  set up Passport Strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  //  authenticate user
  async (req, email, password, callback) => {
    //  email or password error
    const user = await User.findOne({ where: { email } })
    if (!user) return callback(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
    // password can not match
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return callback(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
    // no error
    callback(null, user)
  }
))

// serialize and deserialize user
passport.serializeUser((user, callback) => {
  callback(null, user.id)
})

passport.deserializeUser(async (id, callback) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' }, // as標明我們在model裡面設定的關係
        { model: Restaurant, as: 'LikedRestaurants' },
        { modle: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    callback(null, user.toJSON())
  } catch (err) {
    callback(err)
  }
})

module.exports = passport
