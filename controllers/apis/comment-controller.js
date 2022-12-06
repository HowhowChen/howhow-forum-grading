const commentServices = require('../../services/comment-services')

const commentController = {
  getComments: (req, res, next) => {
    commentServices.getComments(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putComment: (req, res, next) => {
    commentServices.putComment(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = commentController
