const { body, validationResult } = require('express-validator')

const registerValidations = [
  body('name').trim().not().isEmpty().withMessage('名字不可空白'),
  body('email').isEmail().normalizeEmail().withMessage('請輸入正確Email'),
  body('password').trim().not().isEmpty().withMessage('密碼不可空白').bail().isLength({ min: 5 }).withMessage('密碼大於5位'),
  body('passwordCheck').trim().not().isEmpty().withMessage('確認密碼不可空白').bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('密碼與確認密碼不相符')
      }
      return true //  沒問題務必回傳true!!
    })
]

module.exports = {
  registerValidator: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    //  平行執行註冊驗證
    await Promise.all(registerValidations.map(registerValidation => (
      registerValidation.run(req)
    )))
    //  驗證結果
    const errors = validationResult(req)
    //  結果有錯
    if (!errors.isEmpty()) {
      return res.status(422).render('signup', {
        errors: errors.array(),
        name,
        email,
        password,
        passwordCheck
      })
    }

    next()
  }
}
