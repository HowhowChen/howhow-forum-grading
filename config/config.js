require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DEV_DATABASE_USERNAME,
    password: process.env.DEV_DATABASE_PASSWORD,
    database: process.env.DEV_DATABASE,
    host: process.env.DEV_DATABASE_HOST,
    dialect: process.env.DEV_DATABASE_CHOOSE
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_CHOOSE,
    dialectOptions: {
      ssl: true
    }
  },
  travis: {
    username: 'travis',
    database: 'forum',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  }
}
