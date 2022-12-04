module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')
    next(err)
  },
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.stauts || 500).json({
        stauts: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        stauts: 'error',
        message: `${err}`
      })
    }
    next()
  }
}
