const bcrypt = require('bcryptjs')
const { User, sequelize } = require('../models')
const { QueryTypes } = require('sequelize')

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
  }
}

module.exports = userServices
