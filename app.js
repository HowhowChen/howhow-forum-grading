if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

require('./models')

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
//  使用handlebars設為樣板引擎
app.set('view engine', 'hbs')
//  使用body parser
app.use(express.urlencoded({ extended: true }))

//  設定session
app.use(session({
  secret: process.env.SESSION_SECRECT,
  resave: false,
  saveUninitialized: false
}))

// 設定Passport初始化, 啟用session功能
app.use(passport.initialize())
app.use(passport.session())

//  使用flash
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(methodOverride('_method'))
//  設立路由 讀取該路徑中的檔案
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
