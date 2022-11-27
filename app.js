if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

require('./models')

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs' }))
//  使用handlebars設為樣板引擎
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

//  設定session
app.use(session({
  secret: process.env.SESSION_SECRECT,
  resave: false,
  saveUninitialized: false
}))

//  使用flash
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
