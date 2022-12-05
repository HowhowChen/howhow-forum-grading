const commentServices = require('../../services/comment-services')

const commentController = {
  getComments: (req, res, next) => {
    commentServices.getComments(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = commentController
